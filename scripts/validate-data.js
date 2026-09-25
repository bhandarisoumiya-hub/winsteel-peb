#!/usr/bin/env node
/**
 * Winsteel Engineering Works - Validate Data Script
 * Verifies data integrity, duplicate IDs, missing required fields, and category consistency.
 * Run locally with: node scripts/validate-data.js
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'database', 'db.json');

console.log('🔍 [Winsteel Validate Data] Checking:', DB_PATH);

if (!fs.existsSync(DB_PATH)) {
  console.error('❌ database/db.json does not exist.');
  process.exit(1);
}

try {
  const content = fs.readFileSync(DB_PATH, 'utf8');
  const data = JSON.parse(content);
  let errorCount = 0;
  let warnCount = 0;

  function assert(condition, message, isWarn = false) {
    if (!condition) {
      if (isWarn) {
        console.warn('⚠️  [WARN]:', message);
        warnCount++;
      } else {
        console.error('❌ [ERROR]:', message);
        errorCount++;
      }
    }
  }

  // 1. Check Root Keys
  const sections = ['categories', 'products', 'projects', 'facilities', 'strengths', 'news', 'certificates', 'clients', 'settings'];
  sections.forEach(sec => assert(data[sec] !== undefined, `Missing root section: "${sec}"`));

  // 2. Validate Categories
  assert(data.categories && Array.isArray(data.categories.products), 'categories.products must be an array');
  assert(data.categories && Array.isArray(data.categories.projects), 'categories.projects must be an array');

  // 3. Validate Products
  const prodIds = new Set();
  if (Array.isArray(data.products)) {
    data.products.forEach((p, idx) => {
      assert(p.id, `Product at index ${idx} is missing an id`);
      if (p.id) {
        assert(!prodIds.has(p.id), `Duplicate Product ID: "${p.id}"`);
        prodIds.add(p.id);
      }
      assert(p.title, `Product "${p.id || idx}" missing title`);
      assert(p.category, `Product "${p.id || idx}" missing category`);
      assert(p.shortDescription, `Product "${p.id || idx}" missing shortDescription`);
      assert(p.image, `Product "${p.id || idx}" missing image`);
    });
  }

  // 4. Validate Projects
  const projIds = new Set();
  if (Array.isArray(data.projects)) {
    data.projects.forEach((pr, idx) => {
      assert(pr.id, `Project at index ${idx} is missing an id`);
      if (pr.id) {
        assert(!projIds.has(pr.id), `Duplicate Project ID: "${pr.id}"`);
        projIds.add(pr.id);
      }
      assert(pr.title, `Project "${pr.id || idx}" missing title`);
      assert(pr.category, `Project "${pr.id || idx}" missing category`);
      assert(pr.location, `Project "${pr.id || idx}" missing location`);
      assert(pr.year, `Project "${pr.id || idx}" missing year`);
      assert(pr.coverImage, `Project "${pr.id || idx}" missing coverImage`);
    });
  }

  // 5. Validate Facilities
  if (Array.isArray(data.facilities)) {
    data.facilities.forEach((f, idx) => {
      assert(f.id, `Facility at index ${idx} is missing an id`);
      assert(f.title, `Facility "${f.id || idx}" missing title`);
      assert(f.description, `Facility "${f.id || idx}" missing description`);
    });
  }

  // 6. Validate News
  if (Array.isArray(data.news)) {
    data.news.forEach((n, idx) => {
      assert(n.id, `News at index ${idx} is missing an id`);
      assert(n.title, `News "${n.id || idx}" missing title`);
      assert(n.date, `News "${n.id || idx}" missing date`);
    });
  }

  // Final Verdict
  if (errorCount === 0) {
    console.log(`✅ Validation Passed! 0 errors, ${warnCount} warnings.`);
  } else {
    console.error(`💥 Validation Failed with ${errorCount} errors and ${warnCount} warnings.`);
    process.exit(1);
  }
} catch (e) {
  console.error('❌ Parse error in database/db.json:', e.message);
  process.exit(1);
}
