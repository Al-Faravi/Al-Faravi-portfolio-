const express = require('express');
const router = express.Router();
const { Project, Experience, Certification, Blog, Featured, Status } = require('../models/PortfolioItem');

// ===========================================
// HELPER FUNCTION FOR CRUD
// ===========================================
const createCrudRoutes = (routePath, Model) => {
    // GET ALL
    router.get(`/${routePath}`, async (req, res) => {
        try {
            const items = await Model.find();
            res.json(items);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // CREATE
    router.post(`/${routePath}`, async (req, res) => {
        try {
            const newItem = new Model(req.body);
            await newItem.save();
            res.json(newItem);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // UPDATE
    router.put(`/${routePath}/:id`, async (req, res) => {
        try {
            const updatedItem = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json(updatedItem);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // DELETE
    router.delete(`/${routePath}/:id`, async (req, res) => {
        try {
            await Model.findByIdAndDelete(req.params.id);
            res.json({ message: 'Deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
};

// ===========================================
// INITIALIZE ROUTES
// ===========================================

// 1. Projects API ( /api/projects )
createCrudRoutes('projects', Project);

// 2. Experience API ( /api/experience )
createCrudRoutes('experience', Experience);

// 3. Certifications API ( /api/certs )
createCrudRoutes('certs', Certification);

// 4. Blogs API ( /api/blogs )
createCrudRoutes('blogs', Blog);

// 5. Featured API ( /api/featured )
createCrudRoutes('featured', Featured);


// ===========================================
// SPECIAL ROUTE FOR STATUS (SINGLETON)
// ===========================================
// Get Status
router.get('/status', async (req, res) => {
    const status = await Status.findOne();
    // Return default if not found
    res.json(status || { statusText: "Available", statusColor: "#10B981" });
});

// Update Status (Create if doesn't exist, Update if does)
router.post('/status', async (req, res) => {
    try {
        let status = await Status.findOne();
        if (status) {
            // Update existing
            status.statusText = req.body.statusText;
            status.statusColor = req.body.statusColor;
            await status.save();
        } else {
            // Create new
            status = new Status(req.body);
            await status.save();
        }
        res.json(status);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Handle PUT for status as well just in case frontend sends PUT
router.put('/status/:id', async (req, res) => {
    try {
        const updated = await Status.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;