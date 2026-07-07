const http = require('http');

const data = JSON.stringify({
  title: "cheking",
  description: "cheking",
  dueDate: "2026-07-08T17:30"
});

const req = http.request({
  hostname: 'localhost',
  port: 3001,
  path: '/api/courses/cmonszx3w0005kmaocf8cy9fu/assignments',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': 'token=YOUR_TOKEN_HERE' // We can't really get the token easily without login.
  }
}, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log('Status:', res.statusCode, 'Body:', body));
});

req.on('error', e => console.error(e));
req.write(data);
req.end();
