'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('room_allocations', {
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
      room_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'rooms',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active'
      },
      allocated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Add indexes
    await queryInterface.addIndex('room_allocations', ['student_id']);
    await queryInterface.addIndex('room_allocations', ['room_id']);
    await queryInterface.addIndex('room_allocations', ['status']);
    
    // Add unique constraint to prevent duplicate active allocations
    await queryInterface.addConstraint('room_allocations', {
      type: 'unique',
      fields: ['student_id', 'room_id'],
      name: 'unique_student_room_allocation'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('room_allocations');
  }
};