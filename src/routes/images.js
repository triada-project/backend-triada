const express = require('express');
const router = express.Router();
const { upload } = require('../helpers/s3');
const {
  createProfilePicture,
  createImage,
  deleteImage,
  getAllImages,
} = require('../controllers/imageController');
const authenticateToken = require('../middlewares/authenticateToken');

router.post(
  '/profile-picture/:userId',
  upload.single('profilePicture'),
  (req, res, next) => {
    const {
      file,
      params: { userId },
    } = req;
    createProfilePicture(userId, file, next);
  },
);

router.post(
  '/images/:userId',
  authenticateToken,
  upload.array('images', 10),
  (req, res, next) => {
    const {
      files,
      params: { userId },
    } = req;
    Promise.all(files.map((file) => createImage(userId, file, next)))
      .then(() =>
        next({
          status: 201,
          send: { success: true, message: 'Images uploaded successfully' },
        }),
      )
      .catch((error) =>
        next({
          status: 500,
          send: {
            success: false,
            message: error.message || 'Internal Server Error',
          },
        }),
      );
  },
);

router.get('/images/:userId', authenticateToken, (req, res, next) => {
  const {
    params: { userId },
  } = req;
  getAllImages(userId, next);
});

router.delete(
  '/images/:userId/:imageKey',
  authenticateToken,
  (req, res, next) => {
    const {
      params: { userId, imageKey },
    } = req;
    deleteImage(userId, imageKey, next);
  },
);

module.exports = router;
