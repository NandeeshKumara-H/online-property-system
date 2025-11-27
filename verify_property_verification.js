const http = require('https');
const fs = require('fs');
const path = require('path');

function makeRequest(options, data = null, headers = {}) {
    return new Promise((resolve, reject) => {
        const reqOptions = { ...options, headers: { ...options.headers, ...headers } };
        const req = http.request(reqOptions, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ statusCode: res.statusCode, body: JSON.parse(body) });
                } catch (e) {
                    resolve({ statusCode: res.statusCode, body });
                }
            });
        });
        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
}

async function run() {
    try {
        console.log('--- Starting Verification ---');

        // 1. Login User
        console.log('1. Logging in User...');
        const userLogin = await makeRequest({
            hostname: 'online-property-system-1.onrender.com', path: '/api/login-password', method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, JSON.stringify({ email: 'verifier@example.com', password: 'password123' }));

        if (userLogin.statusCode !== 200) {
            console.log('Login Body:', JSON.stringify(userLogin.body));
            throw new Error('User login failed: ' + userLogin.statusCode);
        }
        const userToken = userLogin.body.token;
        console.log('User Logged In. Token:', userToken.substring(0, 10) + '...');

        // 2. Submit Property (Multipart)
        console.log('2. Submitting Property...');
        const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
        let body = '';

        const fields = {
            title: 'Verified Villa',
            description: 'A beautiful villa for verification',
            price: 5000000,
            district: 'Bangalore',
            taluka: 'North',
            hobli: 'Yelahanka',
            village: 'Agrahara',
            address: '123 Main St',
            surveyNumber: '123/4B',
            type: 'Buy',
            size: 1200,
            sizeUnit: 'sq ft',
            ownerName: 'Verifier Owner',
            contactNumber: '9999999999'
        };

        for (const [key, value] of Object.entries(fields)) {
            body += `--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${value}\r\n`;
        }

        // Dummy file
        body += `--${boundary}\r\nContent-Disposition: form-data; name="verificationDocs"; filename="doc.txt"\r\nContent-Type: text/plain\r\n\r\nDummy Doc Content\r\n`;
        body += `--${boundary}--`;

        const propertyRes = await makeRequest({
            hostname: 'online-property-system-1.onrender.com', path: '/api/property/add', method: 'POST',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'Authorization': `Bearer ${userToken}`
            }
        }, body);

        if (propertyRes.statusCode !== 201) throw new Error('Property submission failed: ' + JSON.stringify(propertyRes.body));
        console.log('Property Submitted. ID:', propertyRes.body._id);

        // 3. Login Admin
        console.log('3. Logging in Admin...');
        const adminLogin = await makeRequest({
            hostname: 'online-property-system-1.onrender.com', path: '/api/admin/login', method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, JSON.stringify({ username: 'admin', password: 'admin' }));

        if (adminLogin.statusCode !== 200) throw new Error('Admin login failed: ' + JSON.stringify(adminLogin.body));
        const adminToken = adminLogin.body.token;
        console.log('Admin Logged In.');

        // 4. Verify Property Details
        console.log('4. Verifying Property Details...');
        const pendingRes = await makeRequest({
            hostname: 'online-property-system-1.onrender.com', path: '/api/admin/properties/pending', method: 'GET',
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });

        const property = pendingRes.body.find(p => p._id === propertyRes.body._id);
        if (!property) throw new Error('Property not found in pending list');

        console.log('Property Found in Pending List.');
        console.log('Checking fields...');
        if (property.surveyNumber !== '123/4B') throw new Error('Survey Number mismatch');
        if (property.hobli !== 'Yelahanka') throw new Error('Hobli mismatch');
        if (property.ownerName !== 'Verifier Owner') throw new Error('Owner Name mismatch');
        if (!property.verificationDocs || property.verificationDocs.length === 0) throw new Error('Verification Docs missing');

        console.log('SUCCESS: All fields verified correctly!');

    } catch (error) {
        console.error('FAILED:', error.message);
        process.exit(1);
    }
}

run();
