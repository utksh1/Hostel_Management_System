const db = require('../config/database');
const { sendResponse } = require('../utils/response');

const getHealthStatus = async (req, res) => {
    try {
        // Test database connection
        const dbStatus = await db.testConnection();
        
        const health = {
            status: 'OK',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV,
            database: dbStatus ? 'connected' : 'disconnected',
            memory: {
                used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
                total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100
            }
        };

        sendResponse(res, 200, health, 'Server is healthy');
    } catch (error) {
        sendResponse(res, 500, null, 'Health check failed');
    }
};

module.exports = {
    getHealthStatus
};