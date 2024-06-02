const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/users');
const authenticateToken = require('../helpers/authenticateToken');

userRouter.get(
  '/signup/email/verify',
  authenticateToken,
  userController.verifyEmail,
);
userRouter.get('/musicianHome', userController.getMusicianHome);
userRouter.get('/:id', userController.getById);
userRouter.get('/dashboard/:id', authenticateToken, userController.getById);
userRouter.post('/', authenticateToken, userController.post);
userRouter.put('/:id', userController.put);
userRouter.delete('/:id', userController.delete);

module.exports = userRouter;
