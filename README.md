# 🏠 Hostel Management System

A comprehensive Hostel Management System designed to automate and streamline day-to-day hostel operations. The system supports multiple user roles with secure, role-based access, making it easy to manage students, rooms, payments, visitors, and complaints.

**👉 Live Demo:** [http://hostelmanagement.whf.bz/](http://hostelmanagement.whf.bz/)

---

## ✨ Features

- User authentication and role-based access control
- Student room allocation
- Hostel fee tracking and payment records
- Visitor logging
- Complaint and maintenance request tracking
- Attendance management
- Secure password recovery (OTP-based)
- Responsive, user-friendly interface

---

## 🧩 User Roles

**Admin**
- Manage all user accounts
- Approve/reject management accounts
- Oversee hostel records

**Management**
- Allocate student rooms
- Manage student profiles
- Handle visitor and complaint logs
- Track maintenance

**Student**
- View room details
- Submit complaints
- Track dues and payments
- View visitor logs

---

## 🛠️ Tech Stack

### Legacy System
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: PHP
- **Database**: MariaDB
- **Hosting**: Googlihost (`http://hostelmanagement.whf.bz/`)

### Modern React Frontend
- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Icons**: Lucide React

---

## 🚀 Getting Started

### Prerequisites

#### For Legacy PHP System
- PHP 7.x or above
- MariaDB
- Web server (XAMPP, WAMP, or similar)

#### For Modern React Frontend
- Node.js (v16 or higher)
- npm or yarn
- Backend API server running on port 3000

#### For Backend API
- Node.js (v16 or higher)
- npm
- MariaDB/MySQL database

### Installation

#### Quick Start - React Frontend (Recommended)

1. **Backend Setup**:
   ```bash
   # Install backend dependencies
   npm install
   
   # Start the backend server
   npm run dev
   ```

2. **Frontend Setup**:
   ```bash
   # Navigate to client directory
   cd client
   
   # Install frontend dependencies
   npm install
   
   # Start the development server
   npm run dev
   ```

3. **Access the Application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

#### Legacy PHP System Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/hostel-management-system.git
