'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('fee_payments', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      gst_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      total_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      payment_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      payment_method: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pending', 'paid', 'overdue'),
        allowNull: false,
        defaultValue: 'pending'
      },
      receipt_number: {
        type: Sequelize.STRING(50),
        unique: true,
        allowNull: false
      },
      month: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Add indexes
    await queryInterface.addIndex('fee_payments', ['student_id']);
    await queryInterface.addIndex('fee_payments', ['receipt_number']);
    await queryInterface.addIndex('fee_payments', ['status']);
    await queryInterface.addIndex('fee_payments', ['month']);
    await queryInterface.addIndex('fee_payments', ['year']);
    await queryInterface.addIndex('fee_payments', ['payment_date']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('fee_payments');
  }
};