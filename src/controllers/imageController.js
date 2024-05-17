const Users = require('../models/users');
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { s3 } = require('../helpers/config');

const s3Client = new S3Client(s3);

const createProfilePicture = async (userId, file, next) => {
  try {
    const user = await Users.findById(userId);
    if (!user) throw { message: 'User not found', status: 404 };

    user.profilePicture = {
      keyImage: file.key,
      URLImage: file.location,
    };

    await user.save();
    next({
      status: 201,
      send: {
        success: true,
        message: 'Profile picture uploaded successfully',
        data: user.profilePicture,
      },
    });
  } catch (error) {
    next({
      status: error.status || 500,
      send: {
        success: false,
        message: error.message || 'Internal Server Error',
      },
    });
  }
};

const createImage = async (userId, file, next) => {
  try {
    const user = await Users.findById(userId);
    if (!user) throw { message: 'User not found', status: 404 };

    const newImage = {
      keyImage: file.key,
      URLImage: file.location,
    };

    user.images.push(newImage);
    await user.save();
    next({
      status: 201,
      send: {
        success: true,
        message: 'Image uploaded successfully',
        data: newImage,
      },
    });
  } catch (error) {
    next({
      status: error.status || 500,
      send: {
        success: false,
        message: error.message || 'Internal Server Error',
      },
    });
  }
};

const deleteImage = async (userId, imageKey, next) => {
  try {
    const user = await Users.findById(userId);
    if (!user) throw { message: 'User not found', status: 404 };

    user.images = user.images.filter((image) => image.keyImage !== imageKey);
    await user.save();

    const params = {
      Bucket: s3.params.Bucket,
      Key: imageKey,
    };

    await s3Client.send(new DeleteObjectCommand(params));
    next({
      status: 200,
      send: { success: true, message: 'Image deleted successfully' },
    });
  } catch (error) {
    next({
      status: error.status || 500,
      send: {
        success: false,
        message: error.message || 'Internal Server Error',
      },
    });
  }
};

const getAllImages = async (userId, next) => {
  try {
    const user = await Users.findById(userId);
    if (!user) throw { message: 'User not found', status: 404 };
    next({
      status: 200,
      send: {
        success: true,
        message: 'All images retrieved successfully',
        data: user.images,
      },
    });
  } catch (error) {
    next({
      status: error.status || 500,
      send: {
        success: false,
        message: error.message || 'Internal Server Error',
      },
    });
  }
};

module.exports = {
  createProfilePicture,
  createImage,
  deleteImage,
  getAllImages,
};
