console.log('Testing server connection...');
const http = require('http');

const req = http.get('http://127.0.0.1:5000/health', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('✅ Server responded:', data);
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});

setTimeout(() => {
  console.error('❌ Request timeout');
  process.exit(1);
}, 5000);
