const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  keyImage: {
    type: String,
  },
});

const Image = mongoose.model('images', imageSchema);

module.exports = { Image };
