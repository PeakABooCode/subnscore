// server/config/db.js
import pkg from "pg";
const { Pool } = pkg;
import "dotenv/config";

// Create a new pool using the connection string from your .env file
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
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
