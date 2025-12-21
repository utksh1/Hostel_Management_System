'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('fee_settings', [
      {
        fee_type: 'Monthly Hostel Fee',
        amount: 3500.00,
        due_day: 10,
        late_fee: 500.00,
        created_at: new Date()
      },
      {
        fee_type: 'Semester Hostel Fee',
        amount: 21000.00,
        due_day: 15,
        late_fee: 1000.00,
        created_at: new Date()
      },
      {
        fee_type: 'Annual Hostel Fee',
        amount: 42000.00,
        due_day: 20,
        late_fee: 2000.00,
        created_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('fee_settings', null, {});
  }
};