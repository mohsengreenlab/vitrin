#!/usr/bin/env node

/**
 * Database Health Check Script
 * Tests SingleStore connection before allowing the app to start
 * Run this to validate your database credentials
 */

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const NC = '\x1b[0m';

async function testConnection() {
  console.log('========================================');
  console.log('SingleStore Database Health Check');
  console.log('========================================\n');

  // Verify environment variables
  console.log('Checking environment variables...');
  const required = ['SINGLESTORE_HOST', 'SINGLESTORE_USER', 'SINGLESTORE_PASSWORD', 'SINGLESTORE_DATABASE'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`${RED}✗ Missing required environment variables: ${missing.join(', ')}${NC}`);
    console.log('\nPlease check your .env file');
    process.exit(1);
  }
  console.log(`${GREEN}✓ All required environment variables present${NC}\n`);

  // Display configuration (masked)
  console.log('Database Configuration:');
  console.log(`  Host: ${process.env.SINGLESTORE_HOST}`);
  console.log(`  Port: ${process.env.SINGLESTORE_PORT || '3306'}`);
  console.log(`  User: ${process.env.SINGLESTORE_USER}`);
  console.log(`  Database: ${process.env.SINGLESTORE_DATABASE}`);
  console.log(`  Password: ${'*'.repeat(8)}`);
  
  // Check SSL certificate
  const sslCertPath = path.join(process.cwd(), 'certs', 'singlestore_bundle.pem');
  const hasSSL = fs.existsSync(sslCertPath);
  console.log(`  SSL Certificate: ${hasSSL ? 'Found' : 'Not Found'}`);
  
  if (!hasSSL) {
    console.log(`${YELLOW}  ⚠ Warning: SSL certificate not found at ${sslCertPath}${NC}`);
    console.log('    Connection will proceed without certificate verification');
  }
  console.log('');

  // Attempt connection
  console.log('Attempting to connect...');
  let connection;
  
  try {
    const config = {
      host: process.env.SINGLESTORE_HOST,
      port: parseInt(process.env.SINGLESTORE_PORT || '3306'),
      user: process.env.SINGLESTORE_USER,
      password: process.env.SINGLESTORE_PASSWORD,
      database: process.env.SINGLESTORE_DATABASE,
      connectTimeout: 20000,
    };

    if (hasSSL) {
      config.ssl = {
        ca: fs.readFileSync(sslCertPath),
        rejectUnauthorized: true,
      };
    } else {
      config.ssl = {
        rejectUnauthorized: false,
      };
    }

    connection = await mysql.createConnection(config);
    console.log(`${GREEN}✓ Connection established${NC}\n`);

    // Test query
    console.log('Running test query...');
    const [rows] = await connection.query('SELECT 1 as test');
    console.log(`${GREEN}✓ Test query successful${NC}\n`);

    // Check tables
    console.log('Checking database tables...');
    const [tables] = await connection.query('SHOW TABLES');
    
    if (tables.length === 0) {
      console.log(`${YELLOW}⚠ No tables found in database${NC}`);
      console.log('  This is normal for a fresh installation');
      console.log('  Tables will be created automatically when the app starts\n');
    } else {
      console.log(`${GREEN}✓ Found ${tables.length} table(s):${NC}`);
      tables.forEach(table => {
        const tableName = Object.values(table)[0];
        console.log(`    - ${tableName}`);
      });
      console.log('');
    }

    // Check migrations table
    try {
      const [migrations] = await connection.query('SELECT id FROM _migrations ORDER BY applied_at');
      if (migrations.length > 0) {
        console.log(`${GREEN}✓ Found ${migrations.length} applied migration(s):${NC}`);
        migrations.forEach(m => console.log(`    - ${m.id}`));
      }
    } catch (err) {
      // Migrations table doesn't exist yet - that's ok
      console.log(`${YELLOW}ℹ Migrations table not yet created (will be created on first run)${NC}`);
    }

    console.log('\n========================================');
    console.log(`${GREEN}✓ Database health check PASSED${NC}`);
    console.log('========================================\n');
    console.log('Your app is ready to connect to SingleStore!');
    
    await connection.end();
    process.exit(0);

  } catch (error) {
    console.error(`\n${RED}✗ Connection failed${NC}\n`);
    console.error('Error Details:');
    console.error(`  Code: ${error.code}`);
    console.error(`  Message: ${error.message}`);
    
    if (error.code === 'ENOTFOUND') {
      console.error('\n  → Check that SINGLESTORE_HOST is correct');
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
      console.error('\n  → Check that:');
      console.error('      1. The port (SINGLESTORE_PORT) is correct');
      console.error('      2. Your firewall allows connections to SingleStore');
      console.error('      3. Your IP is whitelisted in SingleStore settings');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n  → Check that:');
      console.error('      1. SINGLESTORE_USER is correct');
      console.error('      2. SINGLESTORE_PASSWORD is correct');
      console.error('      3. The user has access to SINGLESTORE_DATABASE');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n  → The database name is incorrect or does not exist');
      console.error(`      Database: ${process.env.SINGLESTORE_DATABASE}`);
    }

    console.error('\nTroubleshooting:');
    console.error('  1. Verify credentials in your SingleStore portal');
    console.error('  2. Check .env file has correct values');
    console.error('  3. Ensure your server IP is whitelisted');
    console.error('  4. Test connection from SingleStore portal SQL editor\n');

    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

testConnection();
