# Hostel Management System - React Frontend

A modern React frontend for the Hostel Management System built with Vite, React Router, and Tailwind CSS.

## Features

- 🔐 **Authentication**: Login/Register with form validation
- 🛡️ **Protected Routes**: Route guards for authenticated users
- 🎨 **Modern UI**: Tailwind CSS styling with custom components
- 📱 **Responsive Design**: Mobile-first responsive layout
- 🔄 **State Management**: React Context API for authentication
- 🌐 **API Integration**: Axios for HTTP requests
- 🎯 **Role-based Access**: Different views for admin/student roles
- 📋 **Dashboard**: Real-time statistics and activity feed

## Technology Stack

- **Frontend**: React 18, Vite
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Form Validation**: Built-in validation with error handling

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on port 3000

### Installation

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy .env.example to .env and update the values
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the client directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
client/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   ├── auth.js         # Authentication API endpoints
│   │   └── client.js       # Axios configuration
│   ├── components/
│   │   ├── Layout/
│   │   │   └── Header.jsx  # Main layout with sidebar
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   └── AuthContext.jsx # Authentication context
│   ├── pages/
│   │   ├── Dashboard.jsx   # Main dashboard
│   │   ├── Login.jsx       # Login page
│   │   ├── Register.jsx    # Registration page
│   │   └── Profile.jsx     # User profile
│   ├── App.jsx             # Main app component with routing
│   ├── main.jsx            # React entry point
│   └── index.css           # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── .env
```

## Key Features Implementation

### Authentication Flow

1. **Login**: Users enter credentials, validated and sent to backend
2. **Registration**: New user signup with role selection
3. **Token Storage**: JWT tokens stored in localStorage
4. **Auto-logout**: Token expiration handled automatically

### Protected Routes

- Routes wrapped with `ProtectedRoute` component
- Redirects to login if not authenticated
- Loading states during authentication checks

### API Integration

- Axios instance with interceptors
- Automatic token inclusion in requests
- 401 error handling with automatic logout
- Proxy configuration for development

### Responsive Design

- Mobile-first approach
- Collapsible sidebar for mobile
- Grid layouts that adapt to screen size
- Touch-friendly interface elements

## Available Routes

### Public Routes
- `/login` - User login
- `/register` - User registration

### Protected Routes
- `/dashboard` - Main dashboard
- `/profile` - User profile
- `/rooms` - Room management
- `/students` - Student management (admin only)
- `/payments` - Payment history
- `/reports` - Reports (admin only)
- `/settings` - Application settings

## Customization

### Styling
- Modify `tailwind.config.js` for custom colors/themes
- Update `src/index.css` for custom component styles
- Use Tailwind utility classes throughout components

### API Configuration
- Update `src/api/client.js` for different backend URLs
- Modify `src/api/auth.js` for additional auth endpoints

## Backend Integration

The frontend expects the backend to be running on `http://localhost:3000` with the following endpoints:

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

## Development Tips

1. **Hot Reload**: Vite provides instant hot module replacement
2. **ESLint**: Use `npm run lint` to check code quality
3. **Type Safety**: Consider adding TypeScript for better development experience
4. **State Management**: For complex state, consider adding Redux Toolkit

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS is configured for `http://localhost:5173`
2. **API Connection**: Check if backend is running on port 3000
3. **Build Errors**: Clear node_modules and reinstall dependencies
4. **Port Conflicts**: Change Vite port in `vite.config.js`

### Getting Help

- Check browser console for errors
- Verify environment variables
- Ensure backend API is accessible
- Review network requests in browser dev tools