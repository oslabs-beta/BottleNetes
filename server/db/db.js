/* eslint-disable no-undef */
import dotenv from 'dotenv';
// Sequelize helps with pre and post save. Especially helpful for hashing password before saving
import { Sequelize } from 'sequelize';

dotenv.config();

const DB_URI = process.env.SUPABASE_URI;

const sequelize = new Sequelize(DB_URI, {
  dialect: 'postgres',
  pool: {
    max: 20,
    min: 0,
    acquire: 30000,
    idle: 2000
  },
  logging: console.log
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`📈 Connected to Supabase successfully with pooling!`);
  } catch (error) {
    console.error(`🤬 Unable to connect to Supabase: ${error}`);
  }
};

export default sequelize;