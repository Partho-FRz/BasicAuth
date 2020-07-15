const express = require('express');
const app = express();
app.use(express.json());
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./Router/user');
const Auth = require('./Router/auth');

const uri = process.env.URL
mongoose
  .connect(uri, { useNewUrlParser: true })
  .then(() => {
    console.log('mongodb atlas connected');
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use('/api/users', User);
app.use('/api/auth', Auth);

const port = process.env.PORT || 3001;
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
