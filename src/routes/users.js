const express = require('express');
const router = express.Router();
const users = './src/db/user.json';
const fs = require('fs');
const userController = require('../controllers/users');

router.get('/', userController.getAll);

router.get('/:id', userController.getById);

router.post('/', userController.post);
router.put('/:id', userController.put);
router.delete('/:id', userController.delete);
module.exports = router;
