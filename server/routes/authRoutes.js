const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login (Password)
router.post('/login-password', authController.loginWithPassword);

// Signup OTP
router.post('/signup/initiate', authController.initiateSignup);
router.post('/signup/verify', authController.verifySignup);

// Admin
router.post('/admin/login', authController.adminLogin);

module.exports = router;
