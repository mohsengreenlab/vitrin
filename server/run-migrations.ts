import { pool } from "./db";
import fs from "fs";
import path from "path";

export async function runMigrations() {
  try {
    console.log("Running database migrations...");
    
    const migrationPath = path.join(process.cwd(), "migrations", "0001_create_contacts_table.sql");
    
    if (!fs.existsSync(migrationPath)) {
      console.log("No migrations found, skipping...");
      return;
    }
    
    const sql = fs.readFileSync(migrationPath, "utf-8");
    
    const connection = await pool.getConnection();
    try {
      await connection.query(sql);
      console.log("✓ Database migrations completed successfully");
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("✗ Migration failed:", error);
    throw error;
  }
}
