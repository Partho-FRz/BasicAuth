const express = require('express');
const router = express.Router();
const { User } = require('../Models/userModel');
const _ = require('lodash');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
  let user = await User.findOne(
    { email: req.body.email },
    { email: 1, password: 1, isEmailConfirmed: 1 }
  );
  if (user && user.isEmailConfirmed === false) {
    return res
      .status(400)
      .json('Email is not varified, Please verify your email first');
  }
  if (!user) return res.status(400).json('invalid email or password');
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).json('invalid email or password');

  const token = user.generateAuthToken();
  return res.json(token);
});

module.exports = router;
