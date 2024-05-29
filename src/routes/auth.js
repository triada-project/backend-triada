const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/users');

userRouter.post('/login', userController.login);
userRouter.post('/login/verify', userController.loginVerify);

module.exports = userRouter;
