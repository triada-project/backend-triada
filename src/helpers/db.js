const mongoose = require('mongoose');

module.exports = {
  connect: async () => {
    let connection = await mongoose.connect(
      'mongodb+srv://max-alejandro:0HPAZPwLveYddXzx@personal-cluster.ahpqh0t.mongodb.net/TriadaProject',
    );
    if (connection) console.log('Connected to database');
  },
  disconnect: (done) => {
    mongoose.disconnect(done);
  },
};
