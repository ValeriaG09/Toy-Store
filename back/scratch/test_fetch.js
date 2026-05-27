const http = require('http');

http.get('http://localhost:5000/productos', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('STATUS:', res.statusCode);
    console.log('BODY:', data.substring(0, 100));
    process.exit();
  });
}).on('error', (err) => {
  console.error('ERROR:', err.message);
  process.exit();
});
