import https from 'https';

https.get('https://www.ffjudo.com/actualites', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('--- HTML PREVIEW ---');
    console.log(data.slice(0, 4000));
    console.log('\n--- SEARCH TERMS ---');
    const terms = ['<main', '<section', '<article', 'class="card', 'class="item', 'href="/actualites', '/actualites/', 'data-', 'script', 'window.', 'NewsArticle'];
    for (const term of terms) {
      const idx = data.indexOf(term);
      if (idx !== -1) {
        console.log(`TERM ${term} at ${idx}`);
        console.log(data.slice(Math.max(0, idx - 200), idx + 200));
        console.log('---');
      }
    }
  });
}).on('error', (e) => {
  console.error(e);
  process.exit(1);
});
