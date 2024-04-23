const mongoose = require('mongoose');
// const addressSchema = require('./adressSchema');

const addressSchema = new mongoose.Schema({
  state: String,
  country: String,
  zipCode: Number,
  city: String,
  street: String,
  exteriorNumber: String,
  neighborhood: String,
});

const eventSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  address: {
    type: addressSchema,
    required: true,
  },
  status: {
    type: String,
    //enum: ['agregar estatus'],
    required: true,
  },
  eventConfirmationCode: {
    type: Number,
    // required: true,
  },
  idStripePayment: {
    type: String,
    // required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    // required: true,
  },
  musician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    // required: true,
  },
});

const Events = mongoose.model('Events', eventSchema);
module.exports = Events;
