// server/config/db.js
import pkg from "pg";
const { Pool } = pkg;
import "dotenv/config";

// Determine if we should use SSL based on environment and destination
const useSSL =
  process.env.NODE_ENV === "production" &&
  !process.env.DATABASE_URL?.includes("localhost") &&
  !process.env.DATABASE_URL?.includes("127.0.0.1");

// Create a new pool using the connection string from your .env file
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSSL
    ? {
        rejectUnauthorized: false,
      }
    : false,
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  console.log("✅ Successfully connected to the PostgreSQL database");
  release();
});

export default pool;
