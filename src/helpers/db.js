const mongoose = require('mongoose');
const URI = process.env.URI;

module.exports = {
  connect: async () => {
    let connection = await mongoose.connect(URI);
    if (connection) console.log('Connected to database');
  },
  disconnect: (done) => {
    mongoose.disconnect(done);
  },
};
