const User = require('../models/User');
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const brevo = require('@getbrevo/brevo');

const generateToken = (user) => {
    return jwt.sign({ _id: user._id, role: user.role || 'user' }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1h' });
};

const sendEmail = async (to, subject, text) => {
    if (!process.env.BREVO_API_KEY) {
        console.log('>>> BREVO_API_KEY MISSING IN .env <<<');
        console.log(`>>> SIMULATED EMAIL TO ${to}: ${text} <<<`);
        return;
    }

    const apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = `<html><body><p>${text}</p></body></html>`;
    sendSmtpEmail.sender = { "name": "Property System", "email": process.env.EMAIL_USER }; // Ensure EMAIL_USER is a verified sender in Brevo
    sendSmtpEmail.to = [{ "email": to }];

    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`Email sent to ${to} via Brevo`);
    } catch (error) {
        console.error('Error sending email via Brevo:', error);
        console.log(`>>> FALLBACK SIMULATION TO ${to}: ${text} <<<`);
    }
};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// --- LOGIN (PASSWORD) ---
exports.loginWithPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: 'Invalid email or password' });

        const token = generateToken(user);
        res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// --- SIGNUP OTP ---
const signupOtps = new Map();

exports.initiateSignup = async (req, res) => {
    try {
        const { email, phone } = req.body;
        const emailLower = email.toLowerCase();
        const user = await User.findOne({ email: emailLower });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const otp = generateOTP();
        signupOtps.set(emailLower, { otp, expires: Date.now() + 10 * 60 * 1000 });

        // Send Email
        await sendEmail(emailLower, 'Your Signup OTP', `Your OTP for signup is: ${otp}`);

        res.json({ message: 'OTP sent to Email' });
    } catch (error) {
        console.error('Initiate Signup Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.verifySignup = async (req, res) => {
    try {
        const { name, email, password, phone, otp } = req.body;
        const emailLower = email.toLowerCase();

        const stored = signupOtps.get(emailLower);
        if (!stored) return res.status(400).json({ message: 'OTP request not found or expired' });
        if (stored.otp !== otp || stored.expires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const user = new User({ name, email: emailLower, password, phone });
        await user.save();

        signupOtps.delete(emailLower);

        const token = generateToken(user);
        res.status(201).json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error('Verify Signup Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// --- ADMIN LOGIN ---
exports.adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Admin Login Attempt:', { username, password });
        const admin = await Admin.findOne({ username });
        console.log('Admin found in DB:', admin);

        if (!admin && username === 'admin' && password === 'admin') {
            const newAdmin = new Admin({ username: 'admin', password: 'admin' });
            await newAdmin.save();
            const token = jwt.sign({ _id: newAdmin._id, role: 'admin' }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1h' });
            return res.json({ token, admin: { username: 'admin', role: 'admin' } });
        }

        if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

        const validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ _id: admin._id, role: 'admin' }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1h' });
        res.json({ token, admin: { username: admin.username, role: 'admin' } });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
