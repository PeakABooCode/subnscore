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
  ssl: useSSL ? { rejectUnauthorized: false } : false,
  // Prevents runaway queries from hanging forever and exhausting the connection pool
  statement_timeout: 30000,              // kill any query taking > 30s
  idle_in_transaction_session_timeout: 60000, // kill idle transactions after 60s
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
