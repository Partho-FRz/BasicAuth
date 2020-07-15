require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const {
  userValidate,
  User,
  userUpdateValidate,
} = require('../Models/userModel');
const auth = require('../Middleware/auth');

router.post('/add', async (req, res) => {
  const { error } = userValidate.validate(req.body);
  if (error) return res.status(404).json(error.details[0].message);
  try {
    let user = await User.findOne({
      email: req.body.email,
      isDisabled: false,
    }).count();
    if (user > 0) {
      return res.status(400).json('User already registered`');
    }
    user = new User(
      _.pick(req.body, ['name', 'userName', 'email', 'password', 'isAdmin'])
    );

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.ACCESSSEC
    );
    console.log(token, 'tokennnnnn');
    const check = await sendMail(user.email, token);
    if (check === false) {
      throw new Error('Mail Not Sent');
    }
    return res.json(_.pick(user, ['id', 'name', 'email', 'isAdmin']));
  } catch (err) {
    console.log(err.message);
    return res.json(err.message);
  }
});

router.put('/edit', auth, async (req, res) => {
  const { error } = userUpdateValidate.validate(req.body);
  if (error) return res.status(404).json(error.details[0].message);

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }
  try {
    const check = await User.update(
      { _id: req.user.id },
      _.pick(req.body, ['name', 'email', 'password', 'isAdmin'])
    );

    if (check.nModified > 0) {
      return res.json('Updated');
    }
    return res.json('Not Updated');
  } catch (err) {
    console.log(err.message);
    return res.json(err.message);
  }
});

router.get('/emailvalidate/:token', async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.ACCESSSEC);
    const check = await User.update(
      { _id: decoded.id, isEmailConfirmed: false },
      { isEmailConfirmed: true }
    );
    if (check.nModified > 0) {
      return res.json('Email Confirmed');
    }
    return res.json('Email Already Confirmed');
  } catch (err) {
    return res.json(err.message);
  }
});

const sendMail = async (reciever, token) => {
  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const url = `http://localhost:3001/api/users/emailvalidate/${token}`;
    let info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: reciever,
      subject: 'Email Verification',
      html: `Please Click This Link to Confirm Tour Email: <a href = "${url}">${url}</a>`,
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    return true;
  } catch (err) {
    console.log(err, '.........');
    return false;
  }
};

module.exports = router;
