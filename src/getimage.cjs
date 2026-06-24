const https = require('https');
const options = {
  hostname: 'en.wikipedia.org',
  port: 443,
  path: '/wiki/Malaysian_Red_Crescent_Society',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124'
  }
};
https.get(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    let match = data.match(/https:\/\/upload\.wikimedia\.org[^"]*\.jpg/g);
    if(match) {
        console.log("Found matches:");
        match.forEach(m => console.log(m));
    } else {
        console.log("No jpg found");
    }
  });
}).on('error', (e) => {
    console.error(e);
});
