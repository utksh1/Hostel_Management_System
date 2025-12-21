const express = require('express');
const router = express.Router();

// Import route modules
const healthRoutes = require('./health');
const authRoutes = require('./authRoutes');
const adminRoutes = require('./adminRoutes');

// Mount routes
router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);

// API info endpoint
router.get('/', (req, res) => {
    res.json({
        message: 'Hostel Management System API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            api: '/api'
        }
    });
});

module.exports = router;