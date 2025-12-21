'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      // Payment belongs to User (Student)
      this.belongsTo(models.User, { foreignKey: 'student_id', as: 'student' });
    }
  }
  
  Payment.init({
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
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Amount cannot be empty' },
        min: { args: [0], msg: 'Amount cannot be negative' }
      }
    },
    gst_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      validate: {
        min: { args: [0], msg: 'GST amount cannot be negative' }
      }
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      validate: {
        min: { args: [0], msg: 'Total amount cannot be negative' }
      }
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Payment date cannot be empty' }
      }
    },
    payment_method: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Payment method cannot be empty' },
        len: { args: [2, 50], msg: 'Payment method must be between 2 and 50 characters' }
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'paid', 'overdue'),
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        notEmpty: { msg: 'Status cannot be empty' },
        isIn: {
          args: [['pending', 'paid', 'overdue']],
          msg: 'Status must be pending, paid, or overdue'
        }
      }
    },
    receipt_number: {
      type: DataTypes.STRING(50),
      unique: {
        msg: 'Receipt number already exists'
      },
      allowNull: false
    },
    month: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Month cannot be empty' }
      }
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Year cannot be empty' },
        min: { args: [2020], msg: 'Year must be 2020 or later' },
        max: { args: [2100], msg: 'Year must be 2100 or earlier' }
      }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Payment',
    tableName: 'fee_payments',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  return Payment;
};