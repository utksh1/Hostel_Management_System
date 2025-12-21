'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('fee_settings', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      fee_type: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      due_day: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      late_fee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Add indexes
    await queryInterface.addIndex('fee_settings', ['fee_type']);
    await queryInterface.addIndex('fee_settings', ['due_day']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('fee_settings');
  }
};