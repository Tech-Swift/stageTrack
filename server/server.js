import express from 'express';
import { connectDB, sequelize } from './src/config/db.js';
import dotenv from 'dotenv';

// Import all models to ensure they're registered with Sequelize
import './src/models/index.js';

import authRoutes from './src/routes/authRoutes.js';
import roleRoutes from "./src/routes/roleRoutes.js";
import saccoRoutes from "./src/routes/saccoRoutes.js";
import stageRoutes from "./src/routes/stageRoutes.js";
import vehicleRoutes from "./src/routes/vehicleRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

// CORS configuration (add if needed)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/saccos", saccoRoutes);
app.use("/api/stages", stageRoutes);
app.use("/api/vehicles", vehicleRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Sync models with database
    // alter: true - alters tables to match models (safe for development)
    // force: false - doesn't drop tables (use force: true only if you want to recreate all tables)
    // Note: If you encounter column type errors, you may need to drop the problematic table first
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized successfully.');

    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
