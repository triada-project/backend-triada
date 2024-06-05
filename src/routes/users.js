const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/users');
const authenticateToken = require('../middlewares/authenticateToken');

userRouter.get('/signup/email/verify', userController.verifyEmail);
userRouter.get('/musicianHome', userController.getMusicianHome);
userRouter.get('/:id', userController.getById);
userRouter.get(
  '/dashboard/:id',
  authenticateToken,
  userController.getByIdDashboard,
);
userRouter.post('/', userController.post);
userRouter.put('/:id', authenticateToken, userController.put);
userRouter.delete('/:id', authenticateToken, userController.delete);

module.exports = userRouter;
