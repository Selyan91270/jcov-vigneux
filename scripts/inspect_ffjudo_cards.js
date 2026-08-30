import https from 'https';

https.get('https://www.ffjudo.com/actualites', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const anchor = '<a href="https://www.ffjudo.com/actualite/';
    const idx = data.indexOf(anchor);
    console.log('anchor index', idx);
    if (idx !== -1) {
      console.log(data.slice(Math.max(0, idx - 300), idx + 1200));
    }

    const sectionIdx = data.indexOf('<section class="listing__actu">');
    console.log('section index', sectionIdx);
    if (sectionIdx !== -1) {
      console.log(data.slice(Math.max(0, sectionIdx - 300), sectionIdx + 2000));
    }
  });
}).on('error', (e) => {
  console.error(e);
  process.exit(1);
});
