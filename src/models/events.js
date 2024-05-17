const mongoose = require('mongoose');
//const addressSchema = require('./adressSchema');

const addressSchema = new mongoose.Schema({
  state: String,
  zipCode: String,
  city: String,
  street: String,
  exteriorNumber: String,
  interiorNumber: String,
  neighbourhood: String,
});

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
  },
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
  phoneClient: {
    type: String,
    required: true,
  },
  startHour: {
    type: String,
    required: true,
  },
  endHour: {
    type: String,
    required: true,
  },
  totalHours: {
    type: Number,
    required: true,
  },
  eventFee: {
    type: Number,
    required: true,
  },
  isChecked: {
    type: Boolean,
    default: false,
    required: true,
  },

  status: {
    type: String,
    default: 'pendiente',
    enum: {
      values: ['pendiente', 'activo', 'rechazado', 'finalizado'],
      message: '{VALUE} is not supported',
    },
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
  objectClient: {
    type: Object,
    // required: true,
  },
  objectMusician: {
    type: Object,
    // required: true,
  },
});

const Events = mongoose.model('Events', eventSchema);
module.exports = Events;
