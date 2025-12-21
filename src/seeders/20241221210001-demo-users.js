'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const adminPassword = await bcrypt.hash('admin123', 10);
    const studentPassword1 = await bcrypt.hash('student123', 10);
    const studentPassword2 = await bcrypt.hash('student123', 10);
    const managementPassword = await bcrypt.hash('management123', 10);

    return queryInterface.bulkInsert('users', [
      {
        name: 'Admin User',
        email: 'admin@hms.com',
        password: adminPassword,
        user_type: 'admin',
        roll_number: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'John Smith',
        email: 'john@student.com',
        password: studentPassword1,
        user_type: 'student',
        roll_number: 'STU001',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah@student.com',
        password: studentPassword2,
        user_type: 'student',
        roll_number: 'STU002',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Mike Davis',
        email: 'mike@management.com',
        password: managementPassword,
        user_type: 'management',
        roll_number: null,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};