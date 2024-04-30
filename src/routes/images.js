const express = require('express');
const router = express.Router();
const { uploadImage } = require('../controllers/imageController');

router.post('/:id', uploadImage);

module.exports = router;
