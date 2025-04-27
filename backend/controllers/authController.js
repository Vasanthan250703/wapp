const bcrypt = require('bcryptjs');
const db = require('../config/db');
const sendEmail = require('../utils/sendEmail');

// Temporary store for OTPs
const otpStore = {}; 

// Send OTP controller
exports.sendOtp = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields.' });
    }

    const [existingUser] = await db.query('SELECT * FROM user_logins WHERE username = ? OR email = ?', [username, email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = Math.floor(100000 + Math.random() * 900000);

    otpStore[email] = {
      otp,
      username,
      hashedPassword,
      createdAt: Date.now()
    };

    await sendEmail(email, otp);

    res.status(200).json({ message: 'OTP sent to your email.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify OTP controller
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({ message: 'Please provide email and OTP.' });
    }

    const savedData = otpStore[email];

    if (!savedData) {
      return res.status(400).json({ message: 'OTP expired or not found. Please register again.' });
    }

    if (parseInt(otp) !== savedData.otp) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    // Save user after verifying OTP
    await db.query('INSERT INTO user_logins (username, email, password, isVerified) VALUES (?, ?, ?, ?)', 
      [savedData.username, email, savedData.hashedPassword, 1]);  // <-- Set isVerified = 1

    delete otpStore[email];

    res.status(201).json({ message: 'User registered successfully!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login controller
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM user_logins WHERE username = ? OR email = ?', [username, username]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    if (user.isVerified === 0) {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }

    res.status(200).json({ message: 'Login successful!', user: { id: user.id, username: user.username, email: user.email } });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
