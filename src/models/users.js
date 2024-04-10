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
});

const multimediaSchema = new mongoose.Schema({
  images: Array,
  videos: Array,
});

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    required: true,
    match: [
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      'Debe ingresar un correo valido',
    ],
  },
  password: {
    type: String,
    required: [true, 'El password es requerido'],
    match: /^(.){8,300}$/,
  },
  profilePicture: String,
  role: {
    type: String,
    enum: ['cliente', 'musico'],
    required: true,
  },
  address: {
    type: addressSchema,
    required: true,
  },
  musicianType: {
    type: String,
    required: function () {
      return this.tipo === 'musico';
    },
    enum: {
      values: ['Banda', 'Solista'],
      message: '{VALUE} is not supported',
    },
  },
  eventType: {
    type: Array,
    required: function () {
      return this.tipo === 'musico';
    },
  },
  musicalGenre: {
    type: Array,
    required: function () {
      return this.tipo === 'musico';
    },
  },
  repertory: {
    type: Array,
    required: function () {
      return this.tipo === 'musico';
    },
  },
  description: String,
  multimedia: multimediaSchema,
  eventFee: {
    type: Number,
    required: function () {
      return this.tipo === 'musico';
    },
  },
  anticipationDays: {
    type: Number,
    required: function () {
      return this.tipo === 'musico';
    },
  },
  id_stripe: String,
});

const Users = mongoose.model('Users', userSchema);
module.exports = Users;
