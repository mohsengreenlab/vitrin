import { pool } from "./db";
import fs from "fs";
import path from "path";

async function migrate() {
  try {
    const migrationPath = path.join(process.cwd(), "migrations", "0001_create_contacts_table.sql");
    const sql = fs.readFileSync(migrationPath, "utf-8");
    
    const connection = await pool.getConnection();
    await connection.query(sql);
    connection.release();
    
    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

migrate();
