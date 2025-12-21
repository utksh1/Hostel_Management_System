'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Member extends Model {
    static associate(models) {
      // Member belongs to User
      this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
  }
  
  Member.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    roll_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: {
        msg: 'Roll number already exists'
      },
      validate: {
        notEmpty: { msg: 'Roll number cannot be empty' }
      }
    },
    department: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Department cannot be empty' }
      }
    },
    year_of_study: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Year of study cannot be empty' },
        min: { args: [1], msg: 'Year of study must be at least 1' },
        max: { args: [5], msg: 'Year of study cannot exceed 5' }
      }
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: {
          args: /^[0-9\+\-\s\(\)]+$/,
          msg: 'Phone number contains invalid characters'
        }
      }
    },
    guardian_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Guardian name cannot be empty' },
        len: { args: [2, 255], msg: 'Guardian name must be between 2 and 255 characters' }
      }
    },
    guardian_phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Guardian phone cannot be empty' },
        is: {
          args: /^[0-9\+\-\s\(\)]+$/,
          msg: 'Guardian phone number contains invalid characters'
        }
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Address cannot be empty' }
      }
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Gender cannot be empty' },
        isIn: {
          args: [['male', 'female', 'other']],
          msg: 'Gender must be male, female, or other'
        }
      }
    },
    blood_group: {
      type: DataTypes.STRING(5),
      allowNull: true,
      validate: {
        isIn: {
          args: [['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']],
          msg: 'Invalid blood group'
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
    modelName: 'Member',
    tableName: 'students',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Member;
};