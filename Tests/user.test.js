const { User } = require('../Models/userModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const mongoose = require('mongoose');

describe('user.generateAuthToken', () => {
  it('Should return a valid JWT', () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const user = new User(payload);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, process.env.ACCESSSEC);
    
    const nPay = {
      id: payload._id,
      isAdmin: payload.isAdmin,
    };
    
    expect(decoded).toMatchObject(nPay);
  });
});
