// Builds the public CV PDFs by printing the /en/cv and /ar/cv pages with headless Edge.
// The PDFs therefore contain exactly what the CV page shows (verified content only,
// no date of birth, home address or personal phone).
// Usage: node scripts/build_public_cv.js   (production server must be running on :3000)
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const OUT = path.join(process.cwd(), 'public', 'documents');
const targets = [
  { url: 'http://localhost:3000/en/cv', file: 'Alaa_AbuZaiter_CV_Public.pdf' },
  { url: 'http://localhost:3000/ar/cv', file: 'Alaa_AbuZaiter_CV_Public_AR.pdf' },
];

fs.mkdirSync(OUT, { recursive: true });
for (const t of targets) {
  const out = path.join(OUT, t.file);
  const profile = path.join(os.tmpdir(), `edge-cv-${Date.now()}`);
  execFileSync(EDGE, [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    '--virtual-time-budget=8000',
    `--user-data-dir=${profile}`,
    `--print-to-pdf=${out}`,
    t.url,
  ], { stdio: 'ignore' });
  const size = fs.statSync(out).size;
  console.log(`${t.file}: ${(size / 1024).toFixed(1)} KB`);
}
