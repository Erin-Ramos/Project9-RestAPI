'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {

  }
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A valid input is required'
        },
        notEmpty: {
          msg: 'A first name is required'
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A valid input is required'
        },
        notEmpty: {
          msg: 'A last name is required'
        },
      },
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A valid input is required'
        },
        notEmpty: {
          msg: 'An email address is required'
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, 
      validate: {
        notNull: {
          msg: 'A valid input is required'
        },
        notEmpty: {
          msg: 'A password is required'
        },
      },
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.associate = (models) => {
    User.hasMany(models.Course, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      as: 'courses'
    });
  };

  return User;
};