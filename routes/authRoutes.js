const express = require('express');
const router = express.Router();
const { AuthController } = require('../controllers/authController');

// Login
router.post('/login', AuthController.login);

// Registration
router.post('/register', AuthController.register);

// Token refresh
router.post('/refresh', AuthController.refresh);

// Logout
router.post('/logout', AuthController.logout);

// Get current user profile
router.get('/me', AuthController.me);

// Change password
router.put('/change-password', AuthController.changePassword);

module.exports = router;
