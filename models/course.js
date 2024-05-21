'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Course extends Model { }

  Course.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false, 
      validate: {
        notNull: {
          msg: 'A valid input is required for title',
        }, 
        notEmpty: {
          msg: 'A title is required',
        },
      },
    }, 
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A valid input is required for description',
        }, 
        notEmpty: {
          msg: 'A description is required',
        },
      },
    }, 
    estimatedTime: DataTypes.STRING,
    materialsNeeded: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Course',
  });

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      foreignKey: {
        name: 'userId', 
        allowNull: false
      }, 
      as: 'user' 
    });
  };

  return Course;
};