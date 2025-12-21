# Sequelize ORM Migration Guide

This document describes the migration of the PHP Hostel Management System database schema to Node.js using Sequelize ORM.

## Project Structure

```
src/
├── config/
│   └── config.js              # Database configuration
├── models/                    # Sequelize models
│   ├── index.js              # Model loader and associations
│   ├── user.js               # User model
│   ├── member.js             # Member (Student) model
│   ├── room.js               # Room model
│   ├── roomallocation.js     # Room Allocation model
│   ├── payment.js            # Payment (Fee Payments) model
│   ├── complaint.js          # Complaint model
│   ├── feesettings.js        # Fee Settings model
│   └── adminsettings.js      # Admin Settings model
├── migrations/               # Database migration files
│   ├── 20241221210001-create-users.js
│   ├── 20241221210002-create-students.js
│   ├── 20241221210003-create-rooms.js
│   ├── 20241221210004-create-room-allocations.js
│   ├── 20241221210005-create-fee-payments.js
│   ├── 20241221210006-create-complaints.js
│   ├── 20241221210007-create-fee-settings.js
│   └── 20241221210008-create-admin-settings.js
└── seeders/                  # Database seeding files
    ├── 20241221210001-demo-users.js
    ├── 20241221210002-demo-students.js
    ├── 20241221210003-demo-rooms.js
    ├── 20241221210004-demo-room-allocations.js
    ├── 20241221210005-demo-fee-settings.js
    ├── 20241221210006-demo-payments.js
    ├── 20241221210007-demo-complaints.js
    └── 20241221210008-demo-admin-settings.js
```

## Models and Relationships

### Core Models

1. **User** - Central user authentication and role management
   - Fields: id, name, email, password, user_type, roll_number
   - Relationships: Has one Member, Has many RoomAllocations, Payments, Complaints
   
2. **Member** - Student detailed information (maps to existing 'students' table)
   - Fields: user_id, roll_number, department, year_of_study, phone, guardian_info, address, gender, blood_group
   - Relationships: Belongs to User
   
3. **Room** - Hostel room management
   - Fields: room_number, floor, capacity, status
   - Relationships: Has many RoomAllocations
   
4. **RoomAllocation** - Links students to rooms
   - Fields: student_id, room_id, status, allocated_at
   - Relationships: Belongs to User, Belongs to Room
   
5. **Payment** - Fee payment tracking (maps to 'fee_payments' table)
   - Fields: student_id, amount, gst_amount, total_amount, payment_date, method, status, receipt_number, month, year
   - Relationships: Belongs to User
   
6. **Complaint** - Student complaint tracking
   - Fields: student_id, subject, category, description, status
   - Relationships: Belongs to User
   
7. **FeeSettings** - Fee configuration (maps to 'fee_settings' table)
   - Fields: fee_type, amount, due_day, late_fee
   - Relationships: None (configuration table)
   
8. **AdminSettings** - System-wide settings
   - Fields: setting_key, setting_value, setting_type, description, is_active
   - Relationships: None (configuration table)

### Data Validation

All models include comprehensive validation rules:
- **Required Fields**: Non-empty validation with custom error messages
- **Data Types**: Specific type constraints (email, phone numbers, ENUM values)
- **Range Validation**: Minimum/maximum values for numbers, length constraints for strings
- **Format Validation**: Email format, phone number format, blood group validation
- **Unique Constraints**: Email, roll_number, receipt_number, etc.

### Audit Trail

All models include automatic timestamps (created_at, updated_at) for audit purposes:
- Timestamps automatically managed by Sequelize
- User-friendly column names using underscored format
- Consistent timestamp handling across all models

## Installation and Usage

### Prerequisites

- Node.js 14+
- MySQL/MariaDB database
- Existing database schema from PHP system

### Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Test Database Connection**
   ```bash
   node test-connection.js
   ```

4. **Run Migrations**
   ```bash
   npm run migrate
   ```

5. **Seed Sample Data**
   ```bash
   npm run seed
   ```

6. **Complete Setup**
   ```bash
   npm run db:setup  # Runs both migrations and seeds
   ```

## Available Scripts

- `npm run migrate` - Run all pending migrations
- `npm run migrate:undo` - Rollback last migration
- `npm run seed` - Seed database with sample data
- `npm run seed:undo` - Remove all seeded data
- `npm run db:setup` - Run migrations and seeds together
- `node test-connection.js` - Test database connection

## Database Configuration

The configuration supports multiple environments:

```javascript
// src/config/config.js
module.exports = {
  development: { /* Development settings */ },
  test: { /* Test settings */ },
  production: { /* Production settings */ }
};
```

Environment variables can be used for sensitive data:
- DB_USERNAME
- DB_PASSWORD
- DB_NAME
- DB_HOST
- DB_PORT

## Migration Details

### Migration Order

1. **Users** - Foundation table for authentication
2. **Students** - Student details with foreign key to Users
3. **Rooms** - Room inventory
4. **RoomAllocations** - Links students to rooms
5. **FeePayments** - Payment records
6. **Complaints** - Complaint tracking
7. **FeeSettings** - Fee configuration
8. **AdminSettings** - System settings

### Foreign Key Constraints

All foreign key relationships include CASCADE deletion:
- Deleting a User automatically deletes their Member record, RoomAllocations, Payments, and Complaints
- Deleting a Room automatically removes related RoomAllocations
- Maintains referential integrity across the system

## Data Seeding

### Sample Data Included

- **Users**: 1 Admin, 2 Students, 1 Management user
- **Students**: Complete student profiles for both student users
- **Rooms**: 8 sample rooms with various statuses
- **RoomAllocations**: Active room assignments for students
- **FeeSettings**: Monthly, Semester, and Annual fee configurations
- **Payments**: Recent payment history for both students
- **Complaints**: Sample complaints (pending and resolved)
- **AdminSettings**: System configuration settings

### Passwords for Testing

- Admin: `admin@hms.com` / `admin123`
- Student 1: `john@student.com` / `student123`
- Student 2: `sarah@student.com` / `student123`
- Management: `mike@management.com` / `management123`

## Model Features

### Password Hashing

User model automatically hashes passwords using bcrypt:
- Automatic hashing on create/update
- 10 salt rounds for security
- Instance method for password validation

### Validation Examples

```javascript
// User creation with validation
const user = await User.create({
  name: 'John Doe',
  email: 'john@example.com',        // Must be valid email format
  password: 'securepassword123',    // Must be 6+ characters
  user_type: 'student',             // Must be 'admin', 'student', or 'management'
  roll_number: 'STU003'            // Must be unique if provided
});

// Student creation with validation
const student = await Member.create({
  user_id: user.id,
  roll_number: 'STU003',           // Must be unique, 2-20 characters
  department: 'Computer Science',  // Cannot be empty
  year_of_study: 2,               // Must be 1-5
  phone: '9876543210',            // Must match phone format
  // ... other required fields
});
```

## Relationship Usage Examples

```javascript
// Get student with all related data
const student = await User.findOne({
  where: { email: 'john@student.com' },
  include: [
    { model: Member, as: 'member' },
    { model: RoomAllocation, as: 'roomAllocations', include: [{ model: Room, as: 'room' }] },
    { model: Payment, as: 'payments' },
    { model: Complaint, as: 'complaints' }
  ]
});

// Get room with current allocations
const room = await Room.findOne({
  where: { room_number: '101' },
  include: [{
    model: RoomAllocation,
    as: 'roomAllocations',
    where: { status: 'active' },
    include: [{ model: User, as: 'student' }]
  }]
});
```

## Database Indexes

All tables include appropriate indexes for performance:
- Primary key indexes
- Foreign key indexes
- Email and roll_number unique indexes
- Status and type indexes for filtering
- Date indexes for time-based queries

## Error Handling

Models include comprehensive error messages for validation failures:
```javascript
try {
  await User.create({ email: 'invalid-email', password: '123' });
} catch (error) {
  // Error messages like:
  // "Must be a valid email address"
  // "Password must be between 6 and 255 characters"
}
```

## Next Steps

1. Build Express.js API endpoints using these models
2. Create authentication middleware using User model
3. Implement role-based access control
4. Add transaction support for complex operations
5. Create database views for reporting
6. Implement soft deletes for historical data
7. Add full-text search capabilities

## Support

For issues or questions about the migration:
1. Check Sequelize documentation: https://sequelize.org/
2. Verify database credentials and connectivity
3. Ensure Node.js version compatibility
4. Check migration file timestamps and order