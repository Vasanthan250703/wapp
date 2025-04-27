const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, 'your_secret_key', { expiresIn: '7d' });
};

module.exports = generateToken;
