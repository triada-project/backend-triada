const express = require('express');
const router = express.Router();
const users = './src/db/user.json';
const fs = require('fs');
const userController = require('../controllers/users');

router.get('/', userController.getAll);

router.get('/:id', userController.getById);

// router.get('/', (req, res) => {
//   console.log(req.params);
//   res.status(200).send(`Hello world get router param ${req.params}`);
// });
router.post('/', userController.post);
module.exports = router;
