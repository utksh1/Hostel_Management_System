const express = require('express');
const router = express.Router();

const { AuthController, validateRegistration, validateLogin, validatePasswordChange } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

// Public routes
// POST /api/auth/register - User registration
router.post('/register', validateRegistration, AuthController.register);

// POST /api/auth/login - User login
router.post('/login', validateLogin, AuthController.login);

// POST /api/auth/refresh - Refresh access token
router.post('/refresh', AuthController.refresh);

// Protected routes
// POST /api/auth/logout - User logout
router.post('/logout', verifyToken, AuthController.logout);

// GET /api/auth/me - Get current user profile
router.get('/me', verifyToken, AuthController.me);

// PUT /api/auth/change-password - Change password
router.put('/change-password', verifyToken, validatePasswordChange, AuthController.changePassword);

module.exports = router;