# Authentication System - API Documentation

This document describes the authentication and authorization system implemented for the Hostel Management System.

## Overview

The authentication system provides JWT-based authentication with role-based access control (RBAC). It supports user registration, login, token refresh, logout, and profile management.

## Security Features

- **Password Hashing**: Uses bcrypt with 12 salt rounds
- **JWT Tokens**: Short-lived access tokens (15 minutes) with refresh mechanism
- **Role-Based Access Control**: Admin and Student roles
- **Input Validation**: Comprehensive validation using express-validator
- **Token Verification**: Automatic token validation for protected routes

## Database Schema

The system uses a `users` table with the following structure:

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'student') DEFAULT 'student',
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Environment Variables

Required environment variables (see `.env.example`):

- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name
- `JWT_SECRET`: Secret key for JWT signing (use a long random string)
- `JWT_EXPIRES_IN`: Access token expiration (default: 15m)
- `JWT_REFRESH_EXPIRES_IN`: Refresh token expiration (default: 7d)

## API Endpoints

### Authentication Routes (`/api/auth`)

#### 1. User Registration
**POST** `/api/auth/register`

Register a new user account.

**Request Body:**
```json
{
    "email": "user@example.com",
    "password": "SecurePass123",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "role": "student" // optional, defaults to 'student'
}
```

**Validation Rules:**
- Email: Valid email format, normalized
- Password: Minimum 8 characters, must contain uppercase, lowercase, and number
- First/Last name: 2-50 characters
- Phone: Valid mobile phone format (optional)
- Role: Must be 'student' or 'admin'

**Response:**
```json
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "user": {
            "id": 1,
            "email": "user@example.com",
            "role": "student",
            "first_name": "John",
            "last_name": "Doe",
            "phone": "+1234567890",
            "created_at": "2024-01-01T00:00:00.000Z",
            "updated_at": "2024-01-01T00:00:00.000Z"
        },
        "tokens": {
            "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            "expiresIn": "15m"
        }
    }
}
```

#### 2. User Login
**POST** `/api/auth/login`

Authenticate user and receive access tokens.

**Request Body:**
```json
{
    "email": "user@example.com",
    "password": "SecurePass123"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user": {
            "id": 1,
            "email": "user@example.com",
            "role": "student",
            "first_name": "John",
            "last_name": "Doe",
            "phone": "+1234567890",
            "created_at": "2024-01-01T00:00:00.000Z",
            "updated_at": "2024-01-01T00:00:00.000Z"
        },
        "tokens": {
            "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            "expiresIn": "15m"
        }
    }
}
```

#### 3. Token Refresh
**POST** `/api/auth/refresh`

Refresh access token using refresh token.

**Request Body:**
```json
{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
    "success": true,
    "message": "Token refreshed successfully",
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "expiresIn": "15m"
    }
}
```

#### 4. User Logout
**POST** `/api/auth/logout`

Logout user (client should discard tokens).

**Headers:** `Authorization: Bearer <access_token>`

**Response:**
```json
{
    "success": true,
    "message": "Logged out successfully"
}
```

#### 5. Get Current User Profile
**GET** `/api/auth/me`

Get current authenticated user's profile.

**Headers:** `Authorization: Bearer <access_token>`

**Response:**
```json
{
    "success": true,
    "data": {
        "user": {
            "id": 1,
            "email": "user@example.com",
            "role": "student",
            "first_name": "John",
            "last_name": "Doe",
            "phone": "+1234567890",
            "created_at": "2024-01-01T00:00:00.000Z",
            "updated_at": "2024-01-01T00:00:00.000Z"
        }
    }
}
```

#### 6. Change Password
**PUT** `/api/auth/change-password`

Change user's password.

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
    "currentPassword": "SecurePass123",
    "newPassword": "NewSecurePass456"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Password changed successfully"
}
```

## Protected Routes Middleware

To protect routes, use the authentication middleware:

```javascript
const { verifyToken, requireRole, requireAdmin, requireStudentOrAdmin } = require('./middleware/auth');

// Protect route with authentication
app.get('/api/protected', verifyToken, (req, res) => {
    res.json({ message: 'Protected content' });
});

// Require specific role
app.get('/api/admin-only', verifyToken, requireAdmin, (req, res) => {
    res.json({ message: 'Admin only content' });
});

// Allow multiple roles
app.get('/api/student-or-admin', verifyToken, requireStudentOrAdmin, (req, res) => {
    res.json({ message: 'Student or admin content' });
});
```

## Role-Based Access Control

### Roles

- **Student**: Basic access to own data and limited system features
- **Admin**: Full access to all system features

### Usage Examples

```javascript
// Admin only routes
router.get('/admin/users', verifyToken, requireAdmin, UserController.getAllUsers);
router.delete('/admin/users/:id', verifyToken, requireAdmin, UserController.deleteUser);

// Student or admin routes
router.get('/profile', verifyToken, requireStudentOrAdmin, ProfileController.getProfile);
router.put('/profile', verifyToken, requireStudentOrAdmin, ProfileController.updateProfile);

// Student only routes
router.post('/complaints', verifyToken, requireRole('student'), ComplaintController.create);
```

## Error Responses

### Validation Errors
```json
{
    "success": false,
    "message": "Validation failed",
    "errors": [
        {
            "field": "email",
            "message": "Please provide a valid email"
        },
        {
            "field": "password",
            "message": "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        }
    ]
}
```

### Authentication Errors
```json
{
    "success": false,
    "message": "Invalid email or password"
}
```

### Authorization Errors
```json
{
    "success": false,
    "message": "Insufficient permissions",
    "required": ["admin"],
    "current": "student"
}
```

### Token Errors
```json
{
    "success": false,
    "message": "Token has expired",
    "code": "TOKEN_EXPIRED"
}
```

## Default Users

The system includes a default admin user:
- **Email**: admin@hms.com
- **Password**: admin123
- **Role**: admin

⚠️ **Security Note**: Change the default admin password in production!

## Database Migration

To set up the database schema:

1. Ensure your MySQL/MariaDB database is running
2. Run the migration script:
   ```bash
   php config/migrate_users.php
   ```

This will create/update the users table structure and create the default admin user.

## Security Best Practices

1. **Strong JWT Secret**: Use a long, random string for `JWT_SECRET`
2. **Environment Variables**: Never commit sensitive data to version control
3. **HTTPS**: Always use HTTPS in production
4. **Token Expiration**: Keep access tokens short-lived (15 minutes)
5. **Password Policy**: Enforce strong password requirements
6. **Regular Updates**: Update dependencies regularly for security patches

## Testing the API

### Using cURL

#### Register a new user
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "first_name": "Test",
    "last_name": "User"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

#### Access protected route
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Using Postman

1. Import the endpoints
2. Set up environment variables for `baseUrl` and `accessToken`
3. Create a login request to get the access token
4. Use the token in subsequent requests

## Integration with Frontend

### JavaScript/TypeScript Example

```javascript
class AuthService {
    static baseUrl = 'http://localhost:3000/api/auth';
    
    static async register(userData) {
        const response = await fetch(`${this.baseUrl}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        if (data.success) {
            // Store tokens
            localStorage.setItem('accessToken', data.data.tokens.accessToken);
            localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
            localStorage.setItem('user', JSON.stringify(data.data.user));
        }
        
        return data;
    }
    
    static async login(credentials) {
        const response = await fetch(`${this.baseUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });
        
        const data = await response.json();
        if (data.success) {
            // Store tokens
            localStorage.setItem('accessToken', data.data.tokens.accessToken);
            localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
            localStorage.setItem('user', JSON.stringify(data.data.user));
        }
        
        return data;
    }
    
    static async getProfile() {
        const token = this.getAccessToken();
        const response = await fetch(`${this.baseUrl}/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        return await response.json();
    }
    
    static getAccessToken() {
        return localStorage.getItem('accessToken');
    }
    
    static getRefreshToken() {
        return localStorage.getItem('refreshToken');
    }
    
    static logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    }
}
```

This authentication system provides a solid foundation for secure user management in the hostel management system.