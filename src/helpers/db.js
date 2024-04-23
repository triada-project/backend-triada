const mongoose = require('mongoose');

module.exports = {
  connect: async () => {
    let connection = await mongoose.connect(
      'mongodb+srv://artgamir:WL3MrMHQXUW0r7LG@cluster0.m28q23f.mongodb.net/',
    );
    if (connection) console.log('Connected to database');
  },
  disconnect: (done) => {
    mongoose.disconnect(done);
  },
};
