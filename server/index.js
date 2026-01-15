require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const portfolioRoutes = require('./routes/portfolioRoutes'); // Route Import

const app = express();

// =================================
// ⚙️ MIDDLEWARE
// =================================
app.use(express.json());
app.use(cors({
    origin: '*', // Vercel এ ফ্রন্টএন্ড এবং ব্যাকএন্ড একই ডোমেইনে থাকলে '*' বা '/' কাজ করে
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// =================================
// 🗄️ DATABASE CONNECTION (SERVERLESS OPTIMIZED)
// =================================
let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        // যদি অলরেডি কানেক্টেড থাকে, নতুন করে কানেক্ট করার দরকার নেই
        console.log('=> Using existing database connection');
        return;
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log('✅ MongoDB Connected Successfully');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err);
    }
};

// কানেকশন ইনিশিয়লাইজ করা
connectDB();

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
// Handles /projects, /experience, /certs, /status, /blogs, /featured
app.use('/api', portfolioRoutes);

// Test Route
app.get('/', (req, res) => {
    res.send('🚀 Faravi Portfolio API is Running on Vercel!');
});

// =================================
// 🚀 EXPORT APP (FOR VERCEL)
// =================================
// Vercel Serverless Function এর জন্য app.listen() এর বদলে module.exports লাগে
module.exports = app;