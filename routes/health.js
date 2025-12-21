const express = require('express');
const { getHealthStatus } = require('../controllers/healthController');

const router = express.Router();

// Health check endpoint
router.get('/health', getHealthStatus);

module.exports = router;