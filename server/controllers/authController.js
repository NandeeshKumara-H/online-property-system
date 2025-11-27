const User = require('../models/User');
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const generateToken = (user) => {
    return jwt.sign({ _id: user._id, role: user.role || 'user' }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1h' });
};

// Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (to, subject, text) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('>>> EMAIL CREDENTIALS MISSING IN .env <<<');
        console.log(`>>> SIMULATED EMAIL TO ${to}: ${text} <<<`);
        return;
    }

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        });
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
        console.log(`>>> FALLBACK SIMULATION TO ${to}: ${text} <<<`);
    }
};

const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendWhatsApp = async (to, text) => {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_WHATSAPP_NUMBER) {
        console.log('>>> TWILIO CREDENTIALS MISSING IN .env <<<');
        console.log(`>>> SIMULATED WHATSAPP TO ${to}: ${text} <<<`);
        return;
    }

    // Ensure we don't double-prefix if the user added 'whatsapp:' in .env
    const senderNumber = process.env.TWILIO_WHATSAPP_NUMBER.replace('whatsapp:', '').trim();
    const formattedFrom = `whatsapp:${senderNumber}`;

    // Ensure 'to' number has country code (default to +91 for India if missing)
    let cleanTo = to.replace('whatsapp:', '').trim();
    if (!cleanTo.startsWith('+')) {
        cleanTo = `+91${cleanTo}`;
    }
    const formattedTo = `whatsapp:${cleanTo}`;

    console.log(`[DEBUG] Sending WhatsApp From: ${formattedFrom} To: ${formattedTo}`);

    try {
        await client.messages.create({
            body: text,
            from: formattedFrom,
            to: formattedTo
        });
        console.log(`WhatsApp sent to ${formattedTo}`);
    } catch (error) {
        console.error('Error sending WhatsApp:', error);
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
        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const otp = generateOTP();
        signupOtps.set(email, { otp, expires: Date.now() + 10 * 60 * 1000 });

        // Send Email
        await sendEmail(email, 'Your Signup OTP', `Your OTP for signup is: ${otp}`);

        // Send WhatsApp (if phone provided) - DISABLED
        // if (phone) {
        //     await sendWhatsApp(phone, `Your OTP for signup is: ${otp}`);
        // } else {
        //      console.log('No phone number provided for WhatsApp OTP');
        // }

        res.json({ message: 'OTP sent to Email' });
    } catch (error) {
        console.error('Initiate Signup Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.verifySignup = async (req, res) => {
    try {
        const { name, email, password, phone, otp } = req.body;

        const stored = signupOtps.get(email);
        if (!stored) return res.status(400).json({ message: 'OTP request not found or expired' });
        if (stored.otp !== otp || stored.expires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const user = new User({ name, email, password, phone });
        await user.save();

        signupOtps.delete(email);

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
