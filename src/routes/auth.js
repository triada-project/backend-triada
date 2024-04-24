const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/users');

userRouter.post('/login', userController.login);

module.exports = userRouter;
