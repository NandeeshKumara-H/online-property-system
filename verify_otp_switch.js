const http = require('http');

const data = JSON.stringify({
    email: 'test@example.com',
    phone: '1234567890'
});

const options = {
    hostname: 'localhost',
    port: 3000, // Default port from server.js
    path: '/api/signup/initiate',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let body = '';
    res.on('data', (chunk) => {
        body += chunk;
    });
    res.on('end', () => {
        console.log('BODY:', body);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
