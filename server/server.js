
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
if (!process.env.DATABASE_URL || !process.env.SESSION_SECRET) {
  console.error('Missing DATABASE_URL or SESSION_SECRET in .env');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: true }
});

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Sessions stored in PostgreSQL
app.use(session({
  store: new pgSession({
    pool,
    createTableIfMissing: true
  }),
  name: 'wanderly.sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// API status
app.get('/api', (req, res) => {
  res.json({
    status: 'success',
    message: 'Wanderly API is running!'
  });
});

// Get destinations
app.get('/api/destinations', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        country,
        category,
        price,
        duration,
        rating,
        image_url,
        description
      FROM destinations
      ORDER BY id ASC
    `);

    return res.json({
      status: 'success',
      count: result.rows.length,
      destinations: result.rows
    });
  } catch (error) {
    console.error('Destinations error:', error.message);

    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch destinations.'
    });
  }
});

// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Name, email and password are required.'
      });
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedName.length > 100 || normalizedEmail.length > 255) {
      return res.status(400).json({
        status: 'error',
        message: 'Name or email is too long.'
      });
    }

    if (password.length < 8 || Buffer.byteLength(password, 'utf8') > 72) {
      return res.status(400).json({
        status: 'error',
        message: 'Password must be at least 8 characters and no more than 72 bytes.'
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [normalizedName, normalizedEmail, passwordHash]
    );

    const user = result.rows[0];

    req.session.regenerate((sessionError) => {
      if (sessionError) {
        console.error('Signup session error:', sessionError);
        return res.status(500).json({
          status: 'error',
          message: 'Account created, but session could not start. Please log in.'
        });
      }

      req.session.userId = user.id;

      req.session.save((saveError) => {
        if (saveError) {
          console.error('Signup session save error:', saveError);
          return res.status(500).json({
            status: 'error',
            message: 'Account created, but session could not be saved. Please log in.'
          });
        }

        return res.status(201).json({
          status: 'success',
          message: 'Account created successfully.',
          user
        });
      });
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        status: 'error',
        message: 'An account with this email already exists.'
      });
    }

    console.error('Signup error:', error.message);

    return res.status(500).json({
      status: 'error',
      message: 'Unable to create account.'
    });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required.'
      });
    }

    const result = await pool.query(
      `SELECT id, name, email, password_hash, created_at
       FROM users
       WHERE email = $1`,
      [email.trim().toLowerCase()]
    );

    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password.'
      });
    }

    req.session.regenerate((sessionError) => {
      if (sessionError) {
        console.error('Login session error:', sessionError);
        return res.status(500).json({
          status: 'error',
          message: 'Unable to start session.'
        });
      }

      req.session.userId = user.id;

      req.session.save((saveError) => {
        if (saveError) {
          console.error('Login session save error:', saveError);
          return res.status(500).json({
            status: 'error',
            message: 'Unable to save session.'
          });
        }

        return res.json({
          status: 'success',
          message: 'Login successful.',
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            created_at: user.created_at
          }
        });
      });
    });
  } catch (error) {
    console.error('Login error:', error.message);

    return res.status(500).json({
      status: 'error',
      message: 'Unable to log in.'
    });
  }
});

// Check current logged-in user
app.get('/api/auth/me', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        status: 'error',
        message: 'You are not logged in.'
      });
    }

    const result = await pool.query(
      `SELECT id, name, email, created_at
       FROM users
       WHERE id = $1`,
      [req.session.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'User account not found.'
      });
    }

    return res.json({
      status: 'success',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Session check error:', error.message);

    return res.status(500).json({
      status: 'error',
      message: 'Unable to check session.'
    });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error('Logout error:', error.message);

      return res.status(500).json({
        status: 'error',
        message: 'Unable to log out.'
      });
    }

    res.clearCookie('wanderly.sid', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    return res.json({
      status: 'success',
      message: 'Logged out successfully.'
    });
  });
});

// Database test
app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT NOW() AS database_time'
    );

    return res.json({
      status: 'success',
      message: 'Successfully connected to the Wanderly database!',
      databaseTime: result.rows[0].database_time
    });
  } catch (error) {
    console.error('Database error:', error.message);

    return res.status(500).json({
      status: 'error',
      message: 'Database connection failed.'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Wanderly API running at http://localhost:${PORT}`);
});
