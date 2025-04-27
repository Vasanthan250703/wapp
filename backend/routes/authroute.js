const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Send OTP
router.post('/register/send-otp', authController.sendOtp);

// Verify OTP
router.post('/register/verify-otp', authController.verifyOtp);

// Login
router.post('/login', authController.login);

module.exports = router;
