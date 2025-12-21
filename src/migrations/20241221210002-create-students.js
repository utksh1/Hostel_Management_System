'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('students', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      roll_number: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      department: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      year_of_study: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      guardian_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      guardian_phone: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      gender: {
        type: Sequelize.ENUM('male', 'female', 'other'),
        allowNull: false
      },
      blood_group: {
        type: Sequelize.STRING(5),
        allowNull: true
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
    await queryInterface.addIndex('students', ['user_id']);
    await queryInterface.addIndex('students', ['roll_number']);
    await queryInterface.addIndex('students', ['department']);
    await queryInterface.addIndex('students', ['year_of_study']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('students');
  }
};