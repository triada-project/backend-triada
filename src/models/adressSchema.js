const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  state: String,
  country: String,
  zipCode: String,
  city: String,
  street: String,
  exteriorNumber: String,
  neighborhood: String,
});

module.exports = mongoose.model('Address', addressSchema);
