#!/usr/bin/env node

/**
 * Password Debug Script
 * Shows the exact password being read from .env to help identify encoding issues
 */

import { config } from 'dotenv';

config();

const password = process.env.SINGLESTORE_PASSWORD;

console.log('Password Debug Information:');
console.log('===========================\n');

console.log('Password length:', password ? password.length : 'undefined');
console.log('Password characters (as array):');

if (password) {
  for (let i = 0; i < password.length; i++) {
    const char = password[i];
    const code = password.charCodeAt(i);
    console.log(`  [${i}] '${char}' (ASCII: ${code})`);
  }
  
  console.log('\nPassword (with quotes):', `"${password}"`);
  console.log('Password (escaped):', JSON.stringify(password));
  
  // Check for common problematic characters
  const specialChars = ['$', '!', '#', '@', '%', '^', '&', '*', '(', ')', '{', '}', '[', ']', '\\', '|', '`', '"', "'", ' '];
  const foundSpecial = specialChars.filter(char => password.includes(char));
  
  if (foundSpecial.length > 0) {
    console.log('\n⚠ Found special characters:', foundSpecial.join(', '));
    console.log('These may need to be quoted or escaped in .env file');
  }
  
  // Check for leading/trailing whitespace
  if (password !== password.trim()) {
    console.log('\n⚠ WARNING: Password has leading or trailing whitespace!');
    console.log('Original:', `"${password}"`);
    console.log('Trimmed:', `"${password.trim()}"`);
  }
} else {
  console.log('ERROR: SINGLESTORE_PASSWORD not found in environment');
}
