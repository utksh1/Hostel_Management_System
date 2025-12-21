'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('admin_settings', [
      {
        setting_key: 'hostel_name',
        setting_value: 'Greenwood Hostel',
        setting_type: 'string',
        description: 'Name of the hostel',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        setting_key: 'max_students_per_room',
        setting_value: '4',
        setting_type: 'number',
        description: 'Maximum number of students allowed per room',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        setting_key: 'fee_payment_enabled',
        setting_value: 'true',
        setting_type: 'boolean',
        description: 'Enable or disable online fee payment system',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        setting_key: 'complaint_auto_assign',
        setting_value: 'true',
        setting_type: 'boolean',
        description: 'Automatically assign complaints to management staff',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        setting_key: 'maintenance_schedule',
        setting_value: '{"weekday": "Saturday", "time": "10:00 AM"}',
        setting_type: 'json',
        description: 'Weekly maintenance schedule configuration',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('admin_settings', null, {});
  }
};