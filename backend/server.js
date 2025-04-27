const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path'); // Correct built-in module
const db = require('./config/db');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// 🚀 MySQL connection
db.getConnection()
  .then((connection) => {
    console.log('✅ MySQL Database connected successfully!');
    connection.release();
  })
  .catch((err) => {
    console.error('❌ MySQL Database connection failed:', err.message);
  });

// ✅ Serve static frontend files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ✅ API routes
const authRoutes = require('./routes/authroute');
app.use('/api', authRoutes);
app.use('/', authRoutes);  
// ✅ Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'login.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
