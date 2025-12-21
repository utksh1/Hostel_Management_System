'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // User has one Member (Student details)
      this.hasOne(models.Member, { foreignKey: 'user_id', as: 'member' });
      
      // User has many Room Allocations
      this.hasMany(models.RoomAllocation, { foreignKey: 'student_id', as: 'roomAllocations' });
      
      // User has many Payments
      this.hasMany(models.Payment, { foreignKey: 'student_id', as: 'payments' });
      
      // User has many Complaints
      this.hasMany(models.Complaint, { foreignKey: 'student_id', as: 'complaints' });
    }
  }
  
  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Name cannot be empty' },
        len: { args: [2, 255], msg: 'Name must be between 2 and 255 characters' }
      }
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: {
        msg: 'Email already exists'
      },
      validate: {
        notEmpty: { msg: 'Email cannot be empty' },
        isEmail: { msg: 'Must be a valid email address' }
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Password cannot be empty' },
        len: { args: [6, 255], msg: 'Password must be between 6 and 255 characters' }
      }
    },
    user_type: {
      type: DataTypes.ENUM('admin', 'student', 'management'),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'User type cannot be empty' },
        isIn: {
          args: [['admin', 'student', 'management']],
          msg: 'User type must be admin, student, or management'
        }
      }
    },
    roll_number: {
      type: DataTypes.STRING(20),
      unique: {
        msg: 'Roll number already exists'
      },
      allowNull: true
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
    modelName: 'User',
    tableName: 'users',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    },
    instanceMethods: {
      async validatePassword(password) {
        return bcrypt.compare(password, this.password);
      }
    }
  });

  return User;
};