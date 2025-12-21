'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    static associate(models) {
      // Room has many Room Allocations
      this.hasMany(models.RoomAllocation, { foreignKey: 'room_id', as: 'roomAllocations' });
    }
  }
  
  Room.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    room_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: {
        msg: 'Room number already exists'
      },
      validate: {
        notEmpty: { msg: 'Room number cannot be empty' }
      }
    },
    floor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Floor cannot be empty' },
        min: { args: [0], msg: 'Floor must be 0 or higher' }
      }
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 4,
      validate: {
        notEmpty: { msg: 'Capacity cannot be empty' },
        min: { args: [1], msg: 'Capacity must be at least 1' },
        max: { args: [10], msg: 'Capacity cannot exceed 10' }
      }
    },
    status: {
      type: DataTypes.ENUM('available', 'occupied', 'maintenance'),
      allowNull: false,
      defaultValue: 'available',
      validate: {
        notEmpty: { msg: 'Status cannot be empty' },
        isIn: {
          args: [['available', 'occupied', 'maintenance']],
          msg: 'Status must be available, occupied, or maintenance'
        }
      }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Room',
    tableName: 'rooms',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Room;
};