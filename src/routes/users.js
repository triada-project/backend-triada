const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/users');

userRouter.get('/', userController.getAll);
userRouter.get('/:id', userController.getById);
userRouter.post('/', userController.post);
userRouter.put('/:id', userController.put);
userRouter.delete('/:id', userController.delete);
module.exports = userRouter;
