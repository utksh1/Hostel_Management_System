'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RoomAllocation extends Model {
    static associate(models) {
      // RoomAllocation belongs to User (Student)
      this.belongsTo(models.User, { foreignKey: 'student_id', as: 'student' });
      
      // RoomAllocation belongs to Room
      this.belongsTo(models.Room, { foreignKey: 'room_id', as: 'room' });
    }
  }
  
  RoomAllocation.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'rooms',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active',
      validate: {
        notEmpty: { msg: 'Status cannot be empty' },
        isIn: {
          args: [['active', 'inactive']],
          msg: 'Status must be active or inactive'
        }
      }
    },
    allocated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'RoomAllocation',
    tableName: 'room_allocations',
    underscored: true,
    timestamps: false
  });

  return RoomAllocation;
};