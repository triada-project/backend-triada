const mongoose = require('mongoose');

//const addressSchema = require('./adressSchema');

const addressSchema = new mongoose.Schema({
  state: String,
  country: String,
  zipCode: String,
  city: String,
  street: String,
  exteriorNumber: String,
  neighborhood: String,
});

const multimediaSchema = new mongoose.Schema({
  images: Array,
  videos: Array,
});

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
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
  emailVerified: { type: Boolean, default: false },

  profilePicture: String,
  role: {
    type: String,
    enum: ['cliente', 'musico'],
    required: true,
  },
  // address: {
  //   type: addressSchema,
  //   required: function () {
  //     return this.role === 'musico';
  //   },
  // },
  state: {
    type: String,
    required: function () {
      return this.role === 'musico';
    },
  },
  city: {
    type: String,
    required: function () {
      return this.role === 'musico';
    },
  },
  musicianType: {
    type: String,
    required: function () {
      return this.role === 'musico';
    },
    enum: {
      values: ['Banda', 'Solista'],
      message: '{VALUE} is not supported',
    },
  },
  eventType: {
    type: Array,
    sparse: true,
    required: function () {
      return this.role === 'musico';
    },
  },
  musicalGenre: {
    type: Array,
    sparse: true,
    required: function () {
      return this.role === 'musico';
    },
  },
  repertory: {
    type: Array,
    sparse: true,
    required: function () {
      return this.role === 'musico';
    },
  },
  requirements: {
    type: Array,
    sparse: true,
    required: function () {
      return this.role === 'musico';
    },
  },
  availability: {
    type: Array,
    sparse: true,
    required: function () {
      return this.role === 'musico';
    },
  },
  description: String,
  multimedia: multimediaSchema,
  eventFee: {
    type: Number,
    required: function () {
      return this.role === 'musico';
    },
  },
  maximumHoursEvent: {
    type: Number,
    required: function () {
      return this.role === 'musico';
    },
  },
  id_stripe: String,
});

userSchema.pre('save', function (next) {
  if (this.role === 'cliente') {
    // Eliminar los campos específicos de "músico"
    this.musicianType = undefined;
    this.address = undefined;
    this.state = undefined;
    this.city = undefined;
    this.eventType = undefined;
    this.musicalGenre = undefined;
    this.repertory = undefined;
    this.requirements = undefined;
    this.availability = undefined;
    this.eventFee = undefined;
    this.maximumHoursEvent = undefined;
    this.id_stripe = undefined;
  }
  next();
});

const Users = mongoose.model('Users', userSchema);

module.exports = Users;
