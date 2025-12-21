const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT Secret (should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// Verify JWT token middleware
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access token is required'
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            
            // Get user from database to ensure they still exist and get latest data
            const user = await User.findById(decoded.userId);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Add user info to request object (without password)
            req.user = user.toJSON();
            req.userId = decoded.userId;
            
            next();
        } catch (jwtError) {
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token has expired',
                    code: 'TOKEN_EXPIRED'
                });
            } else if (jwtError.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token'
                });
            }
            throw jwtError;
        }
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during token verification'
        });
    }
};

// Role-based access control middleware
const requireRole = (roles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            const userRole = req.user.role;
            const allowedRoles = Array.isArray(roles) ? roles : [roles];

            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({
                    success: false,
                    message: 'Insufficient permissions',
                    required: allowedRoles,
                    current: userRole
                });
            }

            next();
        } catch (error) {
            console.error('Role check error:', error);
            return res.status(500).json({
                success: false,
                message: 'Server error during role verification'
            });
        }
    };
};

// Admin only middleware
const requireAdmin = requireRole(['admin']);

// Student or Admin middleware
const requireStudentOrAdmin = requireRole(['student', 'admin']);

// Generate JWT token
const generateToken = (userId, role) => {
    return jwt.sign(
        { userId, role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

// Generate refresh token
const generateRefreshToken = (userId, role) => {
    return jwt.sign(
        { userId, role, type: 'refresh' },
        JWT_SECRET,
        { expiresIn: JWT_REFRESH_EXPIRES_IN }
    );
};

// Verify refresh token
const verifyRefreshToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Ensure this is a refresh token
        if (decoded.type !== 'refresh') {
            throw new Error('Not a refresh token');
        }
        
        return decoded;
    } catch (error) {
        throw new Error('Invalid refresh token: ' + error.message);
    }
};

module.exports = {
    verifyToken,
    requireRole,
    requireAdmin,
    requireStudentOrAdmin,
    generateToken,
    generateRefreshToken,
    verifyRefreshToken,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    JWT_REFRESH_EXPIRES_IN
};