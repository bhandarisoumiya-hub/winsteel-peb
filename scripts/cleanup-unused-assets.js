const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const filesToRemove = [
  'assets/images/Overhead Crane Lifting Steel Bundles (1).png',
  'assets/images/Winsteel Integrated Manufacturing Network.png',
  'assets/logo/logo.png',
  'assets/videos/hero-bg.mp4',
  'assets/videos/hero-bg.webm',
  'assets/videos/steel-welding.webm'
];

let totalBytesFreed = 0;

filesToRemove.forEach(relPath => {
  const fullPath = path.join(rootDir, relPath);
  if (fs.existsSync(fullPath)) {
    try {
      const stats = fs.statSync(fullPath);
      totalBytesFreed += stats.size;
      fs.unlinkSync(fullPath);
      console.log(`[DELETED] ${relPath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
    } catch (e) {
      console.error(`[ERROR] Failed to delete ${relPath}:`, e.message);
    }
  } else {
    console.log(`[SKIP] Already absent: ${relPath}`);
  }
});

const videosDir = path.join(rootDir, 'assets', 'videos');
if (fs.existsSync(videosDir) && fs.readdirSync(videosDir).length === 0) {
  try {
    fs.rmdirSync(videosDir);
    console.log(`[REMOVED DIR] assets/videos/`);
  } catch (e) {
    console.error(`[ERROR] Failed to remove assets/videos:`, e.message);
  }
}

console.log(`\nTotal space freed: ${(totalBytesFreed / 1024 / 1024).toFixed(2)} MB`);
