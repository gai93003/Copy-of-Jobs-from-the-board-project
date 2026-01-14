import dotenv from "dotenv"
dotenv.config({ debug: true });
import pkg from "pg";
const { Pool } = pkg;

// Debug: Check if DATABASE_URL is loaded
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log("DATABASE_URL value:", process.env.DATABASE_URL ? "Found (hidden for security)" : "NOT FOUND");

// Configure pool - support both DATABASE_URL and individual credentials
const poolConfig = process.env.DATABASE_URL 
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    }
  : {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    };

console.log("Using DATABASE_URL:", !!process.env.DATABASE_URL);

export const pool = new Pool(poolConfig);

pool.connect().then(() => console.log("DB Connected via Pool"))


