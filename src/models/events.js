const mongoose = require('mongoose');
//const addressSchema = require('./adressSchema');

const addressSchema = new mongoose.Schema({
  state: String,
  zipCode: Number,
  city: String,
  street: String,
  exteriorNumber: String,
  interiorNumber: String,
  neighbourhood: String,
  reference: String,
});

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: false,
  },
  eventType: {
    type: String,
    required: false,
  },
  date: {
    type: String,
    required: false,
  },
  address: {
    type: addressSchema,
    required: false,
  },
  phoneClient: {
    type: String,
    required: false,
  },
  startHour: {
    type: String,
    required: false,
  },
  endHour: {
    type: String,
    required: false,
  },
  totalHours: {
    type: Number,
    required: false,
  },
  eventFee: {
    type: Number,
    required: false,
  },
  isChecked: {
    type: Boolean,
    default: false,
    required: false,
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
      values: ['pendiente', 'aceptado', 'en curso', 'rechazado', 'finalizado'],
      message: '{VALUE} is not supported',
    },
    required: false,
  },
  eventConfirmationCode: {
    type: String,
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
