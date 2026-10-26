
require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const destinations = [
  {
    name: 'Bali, Indonesia',
    country: 'Indonesia',
    category: 'Beach',
    price: 1299,
    duration: '7 days',
    rating: 4.9,
    image_url:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80',
    description:
      'Tropical beaches, lush rice terraces and unforgettable sunsets.'
  },
  {
    name: 'Swiss Alps',
    country: 'Switzerland',
    category: 'Adventure',
    price: 1899,
    duration: '6 days',
    rating: 4.8,
    image_url:
      'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=900&q=80',
    description:
      'Discover breathtaking mountain views and charming alpine villages.'
  },
  {
    name: 'Kenya Safari',
    country: 'Kenya',
    category: 'Adventure',
    price: 1599,
    duration: '5 days',
    rating: 4.9,
    image_url:
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=900&q=80',
    description:
      'Experience incredible wildlife and the beauty of the African savannah.'
  },
  {
    name: 'Maldives Escape',
    country: 'Maldives',
    category: 'Beach',
    price: 2199,
    duration: '8 days',
    rating: 5.0,
    image_url:
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=900&q=80',
    description:
      'Relax in crystal-clear waters and beautiful island resorts.'
  }
];

async function seedDestinations() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    for (const destination of destinations) {
      await client.query(
        `INSERT INTO destinations
          (name, country, category, price, duration, rating, image_url, description)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT DO NOTHING`,
        [
          destination.name,
          destination.country,
          destination.category,
          destination.price,
          destination.duration,
          destination.rating,
          destination.image_url,
          destination.description
        ]
      );
    }

    await client.query('COMMIT');
    console.log('Success! Wanderly destinations have been seeded.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Seeding failed:', error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seedDestinations().catch(async (error) => {
  console.error('Database connection failed:', error.message);
  await pool.end();
  process.exitCode = 1;
});
