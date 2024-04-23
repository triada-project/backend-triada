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

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
