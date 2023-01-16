const express = require('express');
const {verify} = require('../lib/jwt');
const app = express();

const CheckToken = (req, res, next) => {
  const token = req.headers['authorization'];

  res.json(token)

  next()
};

module.exports = {
    CheckToken
}