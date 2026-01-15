require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const portfolioRoutes = require('./routes/portfolioRoutes'); // Route Import

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// =================================
// 🔐 AUTH ROUTE (SECURE PIN CHECK)
// =================================
app.post('/api/auth/login', (req, res) => {
    const { pin } = req.body;

    // 1. Check if ADMIN_PIN is actually set in .env
    if (!process.env.ADMIN_PIN) {
        console.error("❌ Error: ADMIN_PIN is missing in .env file!");
        return res.status(500).json({ success: false, message: "Server Configuration Error" });
    }

    // 2. Validate PIN
    if (pin === process.env.ADMIN_PIN) {
        return res.json({ success: true, message: "Login Successful" });
    } else {
        return res.status(401).json({ success: false, message: "Invalid PIN" });
    }
});

// =================================
// 📂 PORTFOLIO ROUTES
// =================================
// Handles /projects, /experience, /certs, /status
app.use('/api', portfolioRoutes);

// =================================
// 🗄️ DATABASE CONNECTION
// =================================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Test Route
app.get('/', (req, res) => {
  res.send('API is Running...');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});