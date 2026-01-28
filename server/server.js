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
app.use('/api/stages', lazyLoadRoute('./src/routes/stageRoutes.js'));
app.use('/api/vehicles', lazyLoadRoute('./src/routes/vehicleRoutes.js'));

// Start server immediately
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

// Async DB connection + model sync (non-blocking)
(async () => {
  try {
    await connectDB();
    console.log('✅ Database connected');

    // Optional: only sync essential models immediately
    await sequelize.sync({ alter: true });
    console.log('✅ Database models synchronized');

    // You could also preload models selectively if needed:
    // await sequelize.model('User').sync();
    // await sequelize.model('Role').sync();
  } catch (error) {
    console.error('❌ DB initialization error:', error.message);
    // Do NOT exit; server is already running
  }
})();
