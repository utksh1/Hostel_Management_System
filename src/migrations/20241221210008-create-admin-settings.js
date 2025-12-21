'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('admin_settings', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      setting_key: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      setting_value: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      setting_type: {
        type: Sequelize.ENUM('string', 'number', 'boolean', 'json'),
        allowNull: false,
        defaultValue: 'string'
      },
      description: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        onUpdate: Sequelize.NOW
      }
    });

    // Add indexes
    await queryInterface.addIndex('admin_settings', ['setting_key']);
    await queryInterface.addIndex('admin_settings', ['is_active']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('admin_settings');
  }
};