const http = require('https');
const fs = require('fs');
const path = require('path');

// Helper to make HTTP requests
function makeRequest(options, data = null, isMultipart = false, boundary = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
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

        if (data) {
            req.write(data);
        }
        req.end();
    });
}

async function run() {
    try {
        // 1. Login User
        console.log('Logging in user...');
        const loginData = JSON.stringify({ email: 'test@example.com', password: 'password123' });
        // Note: Assuming user exists or we need to signup. Let's try login first.
        // If fails, we might need to signup. But for now assuming 'test@example.com' exists from previous tasks or I should create it.
        // Actually, let's just create a new user to be safe or use a known one.
        // I'll try to signup first, if exists then login.

        let token;
        let userId;

        // Signup/Login logic simplified: just try login, if fail then signup
        // Actually, let's just use a unique email to be sure.
        const email = `test_${Date.now()}@example.com`;
        const password = 'password123';

        // Initiate Signup
        console.log(`Initiating signup for ${email}...`);
        await makeRequest({
            hostname: 'online-property-system-1.onrender.com', path: '/api/auth/signup/initiate', method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, JSON.stringify({ email, phone: '1234567890' }));

        // Verify Signup (OTP is fixed or we need to read it? Wait, I switched to email OTP. 
        // But for verification I can't read email. 
        // However, I can check the logs or just use the fallback if I didn't set email creds.
        // Actually, for this test, I can just use the login endpoint if I had a user.
        // Let's use the admin login to create a user? No.
        // Let's use the 'verify_otp_switch.js' logic but I need the OTP.
        // Wait, I can't easily get the OTP without reading logs.
        // Alternative: Use the existing 'admin' user if possible? No, admin can't post properties usually.
        // Let's look at 'clear-users.js' or 'reset-admin.js'.
        // Or I can just insert a user directly into DB if I had a script for that.

        // BETTER IDEA: Use the 'login-password' endpoint. 
        // Does it work for existing users? Yes.
        // Do I have an existing user? Maybe not.

        // Let's try to login with a hardcoded user that might exist or create one via a direct DB script.
        // I will create a 'create_test_user.js' script first to ensure I have a valid user.

        console.log('Skipping signup in this script, assuming user creation script will be run separately.');
        return;

    } catch (error) {
        console.error('Error:', error);
    }
}

// I will write a separate script to create a user directly in DB to bypass OTP.
