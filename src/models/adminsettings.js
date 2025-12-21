'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AdminSettings extends Model {
    static associate(models) {
      // AdminSettings has no direct relationships
    }
  }
  
  AdminSettings.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    setting_key: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {
        msg: 'Setting key already exists'
      },
      validate: {
        notEmpty: { msg: 'Setting key cannot be empty' },
        len: { args: [2, 100], msg: 'Setting key must be between 2 and 100 characters' }
      }
    },
    setting_value: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: { args: [0, 1000], msg: 'Setting value cannot exceed 1000 characters' }
      }
    },
    setting_type: {
      type: DataTypes.ENUM('string', 'number', 'boolean', 'json'),
      allowNull: false,
      defaultValue: 'string',
      validate: {
        isIn: {
          args: [['string', 'number', 'boolean', 'json']],
          msg: 'Setting type must be string, number, boolean, or json'
        }
      }
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        len: { args: [0, 500], msg: 'Description cannot exceed 500 characters' }
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      validate: {
        isBoolean: { msg: 'Is active must be a boolean value' }
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
    modelName: 'AdminSettings',
    tableName: 'admin_settings',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return AdminSettings;
};