const http = require('http');

const routes = [
  '/',
  '/ar',
  '/en',
  '/ar/about',
  '/en/about',
  '/ar/academic-journey',
  '/en/academic-journey',
  '/ar/leadership',
  '/en/leadership',
  '/ar/research',
  '/en/research',
  '/ar/publications',
  '/en/publications',
  '/ar/conferences',
  '/en/conferences',
  '/ar/teaching',
  '/en/teaching',
  '/ar/supervision',
  '/en/supervision',
  '/ar/activities',
  '/en/activities',
  '/ar/awards',
  '/en/awards',
  '/ar/cv',
  '/en/cv',
  '/ar/contact',
  '/en/contact',
  '/ar/community',
  '/en/community',
  '/ar/media',
  '/en/media',
  '/documents/Alaa_AbuZaiter_CV_Public.pdf',
  '/documents/Alaa_AbuZaiter_CV_Public_AR.pdf'
];

async function checkRoute(r) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000${r}`, (res) => {
      resolve({ route: r, status: res.statusCode });
    }).on('error', (err) => {
      resolve({ route: r, status: 'ERROR: ' + err.message });
    });
  });
}

async function run() {
  console.log('Testing all routes on production server:');
  let allPassed = true;
  for (const r of routes) {
    const res = await checkRoute(r);
    const passed = (res.status === 200 || res.status === 307 || res.status === 308);
    if (!passed) allPassed = false;
    console.log(`  ${r.padEnd(45)} -> ${res.status} [${passed ? 'PASS' : 'FAIL'}]`);
  }
  console.log('\nAll routes verified:', allPassed ? 'SUCCESS (100% OK)' : 'FAILED');
}

run();
