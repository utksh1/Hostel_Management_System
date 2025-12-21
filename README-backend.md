# Node.js Backend for Hostel Management System

This Node.js/Express backend provides RESTful API endpoints for the Hostel Management System.

## 🚀 Features

- **Express.js** server with middleware
- **MySQL/MariaDB** database connection with connection pooling
- **Environment-based configuration**
- **Error handling** and logging
- **Health check** endpoint
- **Security** headers with Helmet
- **CORS** support
- **Graceful shutdown** handling

## 📁 Project Structure

```
├── config/
│   └── database.js          # Database configuration and connection
├── controllers/
│   └── healthController.js  # Health check controller
├── middleware/
│   ├── errorHandler.js      # Global error handler
│   ├── notFound.js          # 404 handler
│   └── requestLogger.js     # Request logging
├── models/
│   └── BaseModel.js         # Base model class
├── routes/
│   ├── api.js              # Main API router
│   └── health.js           # Health check routes
├── utils/
│   ├── asyncHandler.js     # Async error wrapper
│   └── response.js         # Response utility
├── .env                    # Environment variables
├── .gitignore              # Git ignore file
├── package.json            # Dependencies and scripts
├── server.js               # Main server file
└── test-server.js          # Server initialization test
```

## 🛠️ Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. Start the server:
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## 🔧 Configuration

### Environment Variables

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3000)
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_NAME` - Database name
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - JWT secret key (for future authentication)
- `CORS_ORIGIN` - CORS allowed origin

## 📚 API Endpoints

### Base URL: `http://localhost:3000`

- `GET /` - Server information
- `GET /api` - API information
- `GET /api/health` - Health check

## 🧪 Testing

Run the server initialization test:
```bash
node test-server.js
```

## 🗄️ Database

The backend uses MySQL/MariaDB with connection pooling. The database configuration is in `config/database.js`.

### Connection Pool Settings
- Connection limit: 10
- Queue limit: 0 (unlimited)
- Wait for connections: true

## 🛡️ Security

- **Helmet.js** for security headers
- **CORS** configuration
- **Input validation** (to be implemented)
- **Error handling** without exposing sensitive information

## 📝 Development

### Adding New Routes

1. Create controller in `controllers/`
2. Create routes in `routes/`
3. Mount routes in `routes/api.js`

### Adding New Models

1. Extend `BaseModel` class in `models/`
2. Use the database connection from `config/database.js`

## 🔄 Scripts

- `npm start` - Start server in production mode
- `npm run dev` - Start server with nodemon (auto-reload)
- `npm test` - Run tests (placeholder)

## 📊 Logging

Requests are logged with timestamps:
```
[2023-12-21T10:30:45.123Z] GET /api/health
```

## 🚦 Health Check

The `/api/health` endpoint returns:
- Server status
- Uptime
- Memory usage
- Database connection status
- Environment information

## 🔄 Graceful Shutdown

The server handles SIGTERM and SIGINT signals for graceful shutdown, closing database connections before exit.