'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FeeSettings extends Model {
    static associate(models) {
      // FeeSettings has no direct relationships in the original schema
      // but is referenced by Payment model for fee amounts
    }
  }
  
  FeeSettings.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    fee_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Fee type cannot be empty' },
        len: { args: [2, 50], msg: 'Fee type must be between 2 and 50 characters' }
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Amount cannot be empty' },
        min: { args: [0], msg: 'Amount cannot be negative' }
      }
    },
    due_day: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Due day cannot be empty' },
        min: { args: [1], msg: 'Due day must be between 1 and 28' },
        max: { args: [28], msg: 'Due day must be between 1 and 28' }
      }
    },
    late_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      validate: {
        min: { args: [0], msg: 'Late fee cannot be negative' }
      }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'FeeSettings',
    tableName: 'fee_settings',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  return FeeSettings;
};