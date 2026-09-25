#!/usr/bin/env node
/**
 * Winsteel Engineering Works - Build Data Script
 * Synchronizes database/db.json to data/winsteel.json and formats correctly.
 * Run locally with: node scripts/build-data.js
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'database', 'db.json');
const DATA_PATH = path.join(__dirname, '..', 'data', 'winsteel.json');

console.log('🔄 [Winsteel Build Data] Reading from:', DB_PATH);

if (!fs.existsSync(DB_PATH)) {
  console.error('❌ Error: database/db.json not found!');
  process.exit(1);
}

try {
  const rawData = fs.readFileSync(DB_PATH, 'utf8');
  const parsed = JSON.parse(rawData);

  // Validate basic structure
  const requiredKeys = ['categories', 'products', 'projects', 'facilities', 'strengths', 'news', 'certificates', 'clients', 'settings'];
  for (const key of requiredKeys) {
    if (!parsed[key]) {
      console.warn(`⚠️ Warning: Key "${key}" missing in database/db.json`);
    }
  }

  // Ensure data directory exists
  const dataDir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Write pretty JSON to data/winsteel.json
  fs.writeFileSync(DATA_PATH, JSON.stringify(parsed, null, 2), 'utf8');

  console.log('✅ Successfully built data/winsteel.json!');
  console.log(`📊 Statistics:
  - Products:     ${parsed.products ? parsed.products.length : 0}
  - Projects:     ${parsed.projects ? parsed.projects.length : 0}
  - Facilities:   ${parsed.facilities ? parsed.facilities.length : 0}
  - Strengths:    ${parsed.strengths ? parsed.strengths.length : 0}
  - News:         ${parsed.news ? parsed.news.length : 0}
  - Certificates: ${parsed.certificates ? parsed.certificates.length : 0}
  - Clients:      ${parsed.clients ? parsed.clients.length : 0}`);
} catch (err) {
  console.error('❌ Build failed with error:', err.message);
  process.exit(1);
}
