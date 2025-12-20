import dotenv from 'dotenv';
dotenv.config();

import { Sequelize } from 'sequelize';

// Validate DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('Error: DATABASE_URL environment variable is not set.');
  console.error('Please create a .env file with DATABASE_URL=postgresql://username:password@host:port/database_name');
  process.exit(1);
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false, // enable SQL logs in development
  pool: {
    max: 5, // maximum number of connections in pool
    min: 0, // minimum number of connections in pool
    acquire: 30000, // maximum time (ms) to wait for a connection
    idle: 10000 // maximum time (ms) a connection can be idle before being released
  },
  define: {
    freezeTableName: true, // model name = table name
    timestamps: false // we handle timestamps manually in models
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully via Sequelize.');
    console.log(`📊 Database: ${sequelize.getDatabaseName()}`);
  } catch (error) {
    console.error('❌ Unable to connect to PostgreSQL:', error.message);
    console.error('\nPlease check:');
    console.error('1. PostgreSQL server is running');
    console.error('2. DATABASE_URL is correct in your .env file');
    console.error('3. Database exists and credentials are valid');
    process.exit(1);
  }
};

export { sequelize, connectDB };