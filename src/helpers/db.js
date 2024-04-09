const mongoose = require('mongoose');

module.exports = {
  connect: async () => {
    let connection = await mongoose.connect(
      'mongodb+srv://rudyramirezmorales:HGIc2IYs5VpStd0u@cluster0.ucuh1da.mongodb.net/triada',
    );
    if (connection) console.log('Connected to database');
  },
  disconnect: (done) => {
    mongoose.disconnect(done);
  },
};
