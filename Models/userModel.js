require('dotenv').config();
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 50,
    required: true,
  },
  userName: {
    type: String,
    maxlength: 10,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    minlength: 3,
    maxlength: 255,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    minlength: 5,
    required: true,
  },
  isEmailConfirmed: {
    type: Boolean,
    default: false,
  },
  isAuthorized: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      id: this.id,
      isAdmin: this.isAdmin,
    },
    process.env.ACCESSSEC
  );
};

const userValidate = Joi.object({
  name: Joi.string().required(),
  userName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
  isAdmin: Joi.boolean(),
  id: Joi.string(),
});

const userUpdateValidate = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  isAdmin: Joi.boolean(),
  password: Joi.string(),
});
const User = mongoose.model('User', userSchema);

module.exports.User = User;
module.exports.userValidate = userValidate;
module.exports.userUpdateValidate = userUpdateValidate;
