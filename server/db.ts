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
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.getConnection()
  .then(connection => {
    console.log("✓ Successfully connected to SingleStore database");
    connection.release();
  })
  .catch(error => {
    console.error("✗ Failed to connect to SingleStore database:", error.message);
    process.exit(1);
  });

export const db = drizzle(pool, { schema, mode: "default" });
export { pool };
