'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Complaint extends Model {
    static associate(models) {
      // Complaint belongs to User (Student)
      this.belongsTo(models.User, { foreignKey: 'student_id', as: 'student' });
    }
  }
  
  Complaint.init({
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
    subject: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Subject cannot be empty' },
        len: { args: [5, 255], msg: 'Subject must be between 5 and 255 characters' }
      }
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Category cannot be empty' },
        len: { args: [2, 50], msg: 'Category must be between 2 and 50 characters' }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Description cannot be empty' },
        len: { args: [10], msg: 'Description must be at least 10 characters' }
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'resolved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        notEmpty: { msg: 'Status cannot be empty' },
        isIn: {
          args: [['pending', 'resolved', 'rejected']],
          msg: 'Status must be pending, resolved, or rejected'
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
    modelName: 'Complaint',
    tableName: 'complaints',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Complaint;
};