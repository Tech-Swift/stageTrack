import dotenv from 'dotenv';
dotenv.config();

import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
dialect: 'postgres',
logging: false, // disable SQL logs; set true for debugging
define: {
freezeTableName: true, // model name = table name
timestamps: false // we handle timestamps manually
}
});

const connectDB = async () => {
try {
await sequelize.authenticate();
console.log('PostgreSQL connected successfully via Sequelize.');
} catch (error) {
console.error('Unable to connect to PostgreSQL:', error);
process.exit(1);
}
};

export { sequelize, connectDB };