const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Experience = require('../models/Experience');
const GlobalStatus = require('../models/GlobalStatus');
const Certification = require('../models/Certification'); // এই লাইনটি জরুরি

// --- PROJECT ROUTES ---
router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/projects', async (req, res) => {
    try {
        const newProject = new Project(req.body);
        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

// --- EXPERIENCE ROUTES ---
router.get('/experience', async (req, res) => {
    try {
        const exp = await Experience.find().sort({ createdAt: -1 });
        res.json(exp);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/experience', async (req, res) => {
    try {
        const newExp = new Experience(req.body);
        const savedExp = await newExp.save();
        res.status(201).json(savedExp);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

// --- CERTIFICATION ROUTES (এটা মিসিং ছিল) ---
router.get('/certifications', async (req, res) => {
    try {
        const certs = await Certification.find().sort({ createdAt: -1 });
        res.json(certs);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/certifications', async (req, res) => {
    try {
        const newCert = new Certification(req.body);
        const savedCert = await newCert.save();
        res.status(201).json(savedCert);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

// --- STATUS ROUTES ---
router.get('/status', async (req, res) => {
    try {
        const status = await GlobalStatus.findOne();
        res.json(status || { statusText: "Welcome!", statusColor: "gray" });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/status', async (req, res) => {
    try {
        await GlobalStatus.deleteMany({});
        const newStatus = new GlobalStatus(req.body);
        const savedStatus = await newStatus.save();
        res.json(savedStatus);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;