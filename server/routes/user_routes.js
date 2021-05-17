'use strict'
// require in dependencies, Post model, middleware
const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/user')
const router = express.Router()
// ************************************* //
// CREATE - POST /posts
router.post(`https://localhost:5000/users`, (req, res, next) => {
  console.log('*******************************')
  // console.log(req.body)
  User.create(req.body.user)
    .then(res => {
      console.log(res)
    })
    .then(user => {
      res.status(201).json({ user: user })
    })
    .catch(next)
})


module.exports = router
