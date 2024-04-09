const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
  },
  town: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  exteriorNumber: {
    type: String,
    required: true,
  },
  neighborhood: {
    type: String,
    required: true,
  },
});

const eventSchema = new mongoose.Schema({
  eventType: {
    type: Array,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  date: {
    type: Number,
    required: true,
  },
  address: {
    type: addressSchema,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  eventConfirmationCode: {
    type: Number,
    required: true,
  },
  id_stripe_payment: {
    type: String,
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  musician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
});

const Events = mongoose.model('Events', eventSchema);
module.exports = Events;
