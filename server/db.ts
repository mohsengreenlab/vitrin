import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "@shared/schema";

if (!process.env.SINGLESTORE_HOST) {
  throw new Error("SINGLESTORE_HOST environment variable is not set");
}

if (!process.env.SINGLESTORE_USER) {
  throw new Error("SINGLESTORE_USER environment variable is not set");
}

if (!process.env.SINGLESTORE_PASSWORD) {
  throw new Error("SINGLESTORE_PASSWORD environment variable is not set");
}

if (!process.env.SINGLESTORE_DATABASE) {
  throw new Error("SINGLESTORE_DATABASE environment variable is not set");
}

const pool = mysql.createPool({
  host: process.env.SINGLESTORE_HOST,
  port: parseInt(process.env.SINGLESTORE_PORT || "3306"),
  user: process.env.SINGLESTORE_USER,
  password: process.env.SINGLESTORE_PASSWORD,
  database: process.env.SINGLESTORE_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 20000,
  ssl: {
    rejectUnauthorized: false,
  },
});

console.log("SingleStore configuration:");
console.log(`  Host: ${process.env.SINGLESTORE_HOST}`);
console.log(`  Port: ${process.env.SINGLESTORE_PORT || "3306"}`);
console.log(`  User: ${process.env.SINGLESTORE_USER}`);
console.log(`  Database: ${process.env.SINGLESTORE_DATABASE}`);
console.log("Attempting to connect to SingleStore...");

pool.getConnection()
  .then(connection => {
    console.log("✓ Successfully connected to SingleStore database");
    connection.release();
  })
  .catch(error => {
    console.error("✗ Failed to connect to SingleStore database:");
    console.error(`  Error: ${error.message}`);
    console.error(`  Code: ${error.code}`);
    console.error("\nPlease verify:");
    console.error("  1. Host and port are correct");
    console.error("  2. Database credentials are valid");
    console.error("  3. Firewall allows connections from this IP");
    console.error("  4. SSL/TLS is properly configured");
    process.exit(1);
  });

export const db = drizzle(pool, { schema, mode: "default" });
export { pool };
