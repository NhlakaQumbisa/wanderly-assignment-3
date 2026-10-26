
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// Trust Render's HTTPS reverse proxy
if (isProduction) {
  app.set('trust proxy', 1);
}

// Check required environment variables
if (!process.env.DATABASE_URL || !process.env.SESSION_SECRET) {
  console.error('Missing DATABASE_URL or SESSION_SECRET.');
  process.exit(1);
}

// PostgreSQL database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true
  }
});

// Allowed frontend origins
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

// PostgreSQL-backed sessions
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
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// API health check
app.get('/api', (req, res) => {
  res.json({
    status: 'success',
    message: 'Wanderly API is running!'
  });
});

// Database connection test
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

// Get travel destinations
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
      message: 'Failed to load destinations.'
    });
  }
});

// Sign up
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !name.trim() ||
      !email.trim() ||
      password.length < 8
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Provide a name, email and password of at least 8 characters.'
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (
      cleanName.length > 100 ||
      cleanEmail.length > 255 ||
      password.length > 128 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Please enter valid account details.'
      });
    }

    const existingUser = await pool.query(
      'SELECT id FROM users WHERE LOWER(email) = $1',
      [cleanEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        status: 'error',
        message: 'An account with this email already exists.'
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
      [cleanName, cleanEmail, passwordHash]
    );

    const user = result.rows[0];

    req.session.regenerate((error) => {
      if (error) {
        console.error('Session regeneration error:', error);

        return res.status(500).json({
          status: 'error',
          message: 'Account created, but login failed. Please log in.'
        });
      }

      req.session.userId = user.id;

      req.session.save((saveError) => {
        if (saveError) {
          console.error('Session save error:', saveError);

          return res.status(500).json({
            status: 'error',
            message: 'Account created, but session could not be saved.'
          });
        }

        return res.status(201).json({
          status: 'success',
          message: 'Account created successfully!',
          user
        });
      });
    });
  } catch (error) {
    console.error('Signup error:', error.message);

    if (error.code === '23505') {
      return res.status(409).json({
        status: 'error',
        message: 'An account with this email already exists.'
      });
    }

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
      `SELECT id, name, email, password_hash
       FROM users
       WHERE LOWER(email) = $1`,
      [email.trim().toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password.'
      });
    }

    const user = result.rows[0];

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password.'
      });
    }

    req.session.regenerate((error) => {
      if (error) {
        console.error('Session regeneration error:', error);

        return res.status(500).json({
          status: 'error',
          message: 'Unable to start login session.'
        });
      }

      req.session.userId = user.id;

      req.session.save((saveError) => {
        if (saveError) {
          console.error('Session save error:', saveError);

          return res.status(500).json({
            status: 'error',
            message: 'Unable to save login session.'
          });
        }

        return res.json({
          status: 'success',
          message: 'Login successful!',
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          }
        });
      });
    });
  } catch (error) {
    console.error('Login error:', error.message);

    return res.status(500).json({
      status: 'error',
      message: 'Login failed.'
    });
  }
});

// Check current logged-in user
app.get('/api/auth/me', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({
      status: 'error',
      message: 'You are not logged in.'
    });
  }

  try {
    const result = await pool.query(
      'SELECT id, name, email FROM users WHERE id = $1',
      [req.session.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'User not found.'
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
      message: 'Unable to verify session.'
    });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error('Logout error:', error);

      return res.status(500).json({
        status: 'error',
        message: 'Logout failed.'
      });
    }

    res.clearCookie('wanderly.sid', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/'
    });

    return res.json({
      status: 'success',
      message: 'Logged out successfully.'
    });
  });
});

// Start the Express server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Wanderly API running on port ${PORT}`);
});
