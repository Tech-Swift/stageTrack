import express from 'express';
import { connectDB, sequelize } from './src/config/db.js';
import dotenv from 'dotenv';
import authRoutes from './src/routes/authRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());


//mount auth routes
app.use('/api/auth', authRoutes);

const startServer = async () => {
  await connectDB();

  // Sync models (for dev only)
  await sequelize.sync({ alter: true }); // creates tables if not exist

  app.listen(5000, () => console.log('Server running on port 5000'));
};

startServer();
