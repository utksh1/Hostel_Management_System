const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const { 
    generateToken, 
    generateRefreshToken, 
    verifyRefreshToken 
} = require('../middleware/auth');

// Registration validation rules
const validateRegistration = [
    require('express-validator').body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    
    require('express-validator').body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
    require('express-validator').body('first_name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters'),
    
    require('express-validator').body('last_name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters'),
    
    require('express-validator').body('phone')
        .optional()
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
    
    require('express-validator').body('role')
        .optional()
        .isIn(['student', 'admin'])
        .withMessage('Role must be either student or admin')
];

// Login validation rules
const validateLogin = [
    require('express-validator').body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    
    require('express-validator').body('password')
        .notEmpty()
        .withMessage('Password is required')
];

class AuthController {
    // User registration
    static async register(req, res) {
        try {
            // Check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const { email, password, first_name, last_name, phone, role = 'student' } = req.body;

            // Check if user already exists
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: 'User with this email already exists'
                });
            }

            // Hash password
            const saltRounds = 12;
            const passwordHash = await bcrypt.hash(password, saltRounds);

            // Create user
            const user = new User({
                email,
                password: passwordHash,
                role,
                first_name,
                last_name,
                phone
            });

            await user.save();

            // Generate tokens
            const accessToken = generateToken(user.id, user.role);
            const refreshToken = generateRefreshToken(user.id, user.role);

            // Return success response (without password)
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    user: user.toJSON(),
                    tokens: {
                        accessToken,
                        refreshToken,
                        expiresIn: process.env.JWT_EXPIRES_IN || '15m'
                    }
                }
            });

        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error during registration'
            });
        }
    }

    // User login
    static async login(req, res) {
        try {
            // Check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const { email, password } = req.body;

            // Find user by email
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // Generate tokens
            const accessToken = generateToken(user.id, user.role);
            const refreshToken = generateRefreshToken(user.id, user.role);

            // Return success response
            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    user: user.toJSON(),
                    tokens: {
                        accessToken,
                        refreshToken,
                        expiresIn: process.env.JWT_EXPIRES_IN || '15m'
                    }
                }
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error during login'
            });
        }
    }

    // Refresh access token
    static async refresh(req, res) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(400).json({
                    success: false,
                    message: 'Refresh token is required'
                });
            }

            // Verify refresh token
            const decoded = verifyRefreshToken(refreshToken);

            // Get user from database
            const user = await User.findById(decoded.userId);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Generate new access token
            const newAccessToken = generateToken(user.id, user.role);

            res.json({
                success: true,
                message: 'Token refreshed successfully',
                data: {
                    accessToken: newAccessToken,
                    expiresIn: process.env.JWT_EXPIRES_IN || '15m'
                }
            });

        } catch (error) {
            console.error('Token refresh error:', error);
            
            if (error.message.includes('Invalid refresh token')) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid refresh token'
                });
            }
            
            res.status(500).json({
                success: false,
                message: 'Server error during token refresh'
            });
        }
    }

    // Logout
    static async logout(req, res) {
        try {
            // In a more sophisticated implementation, you might want to
            // blacklist the token or store it in a database
            // For now, we'll just return success - the client should discard the tokens
            
            res.json({
                success: true,
                message: 'Logged out successfully'
            });

        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error during logout'
            });
        }
    }

    // Get current user profile
    static async me(req, res) {
        try {
            const user = await User.findById(req.userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.json({
                success: true,
                data: {
                    user: user.toJSON()
                }
            });

        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error fetching profile'
            });
        }
    }

    // Change password
    static async changePassword(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const { currentPassword, newPassword } = req.body;
            const user = await User.findById(req.userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Verify current password
            const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isCurrentPasswordValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
            }

            // Hash new password
            const saltRounds = 12;
            const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

            // Update password
            user.password = newPasswordHash;
            await user.update();

            res.json({
                success: true,
                message: 'Password changed successfully'
            });

        } catch (error) {
            console.error('Change password error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error changing password'
            });
        }
    }
}

// Password change validation rules
const validatePasswordChange = [
    require('express-validator').body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    
    require('express-validator').body('newPassword')
        .isLength({ min: 8 })
        .withMessage('New password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number')
];

module.exports = {
    AuthController,
    validateRegistration,
    validateLogin,
    validatePasswordChange
};