'use strict';

const bcrypt = require('bcryptjs');
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model { }

  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A valid input is required',
        },
        notEmpty: {
          msg: 'A first name is required',
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A valid input is required',
        },
        notEmpty: {
          msg: 'A last name is required',
        },
      },
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A valid input is required',
        },
        notEmpty: {
          msg: 'An email address is required',
        },
        isEmail: {
          msg: 'Must be a valid email address',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A valid input is required',
        },
        notEmpty: {
          msg: 'A password is required',
        },
      },
    },
    confirmedPassword: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      set(val) {
        if (val === this.password) {
          const hashedPassword = bcrypt.hashSync(val, 10);
          this.setDataValue('confirmedPassword', hashedPassword);
        }
      },
      validate: {
        notNull: {
          msg: 'Both passwords must match'
        }, 
        notEmpty: {
          msg: 'Confirmed password is required',
        },
        isConfirmed(val) {
          if (val !== this.password) {
            throw new Error('Passwords do not match');
          }
        },
      },
    },
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
