import { pool } from "./db";
import fs from "fs";
import path from "path";

export async function runMigrations() {
  const connection = await pool.getConnection();
  
  try {
    console.log("Running database migrations...");
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    
    const migrationsDir = path.join(process.cwd(), "migrations");
    
    if (!fs.existsSync(migrationsDir)) {
      console.log("No migrations directory found, skipping...");
      return;
    }
    
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    if (migrationFiles.length === 0) {
      console.log("No migration files found, skipping...");
      return;
    }
    
    for (const file of migrationFiles) {
      const [rows] = await connection.query(
        'SELECT id FROM _migrations WHERE id = ?',
        [file]
      );
      
      if (Array.isArray(rows) && rows.length > 0) {
        console.log(`  ✓ Migration ${file} already applied`);
        continue;
      }
      
      const migrationPath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(migrationPath, "utf-8");
      
      console.log(`  Applying migration: ${file}`);
      await connection.query(sql);
      
      await connection.query(
        'INSERT INTO _migrations (id) VALUES (?)',
        [file]
      );
      
      console.log(`  ✓ Migration ${file} applied successfully`);
    }
    
    console.log("✓ Database migrations completed successfully");
  } catch (error) {
    console.error("✗ Migration failed:", error);
    throw error;
  } finally {
    connection.release();
  }
}
