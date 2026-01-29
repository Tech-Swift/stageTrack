// server.js
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import { connectDB, sequelize } from './src/config/db.js';

const app = express();
app.use(express.json());

// CORS configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Health check endpoint (non-blocking)
app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: 'ok', db: 'connected' });
  } catch {
    res.json({ status: 'ok', db: 'pending' });
  }
});

// Helper function to lazy-load routes
const lazyLoadRoute = (path) => async (req, res, next) => {
  try {
    const { default: routeHandler } = await import(path);
    return routeHandler(req, res, next);
  } catch (err) {
    next(err);
  }
};

// Mount routes lazily
app.use('/api/auth', lazyLoadRoute('./src/routes/authRoutes.js'));
app.use('/api/roles', lazyLoadRoute('./src/routes/roleRoutes.js'));
app.use('/api/saccos', lazyLoadRoute('./src/routes/saccoRoutes.js'));
app.use('/api/routes', lazyLoadRoute('./src/routes/routeRoutes.js'));
app.use('/api/vehicles', lazyLoadRoute('./src/routes/vehicleRoutes.js'));
app.use('/api/trips', lazyLoadRoute('./src/routes/tripLogRoutes.js'));

// Start server immediately
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

// Async DB connection + model sync (non-blocking)
async function startServer() {
  try {
    console.log('🔄 Connecting to database...');
    await connectDB();
    console.log('✅ PostgreSQL connected successfully via Sequelize.');

    console.log('🔄 Syncing models...');
    await sequelize.sync({ alter: true });
    console.log('✅ Database models synchronized');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (err) {
    console.error('❌ Server startup error:', err.message);
    process.exit(1); // exit only if you really cannot connect
  }
}

startServer();
