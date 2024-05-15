const Users = require('../models/users');
const jwt = require('../helpers/jwt');
const twilio = require('twilio');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
const client = require('twilio')(accountSid, authToken);

const sendVerificationEmail = async (email) => {
  try {
    const verification = await client.verify.v2
      .services(serviceSid)
      .verifications.create({
        to: email,
        channel: 'email',
        channelConfiguration: {
          template_id: 'd-7596721b285940709a118c0a42f6f0d7',
          dynamic_template_data: {
            to: email,
            // Puedes añadir más campos de tu plantilla aquí
          },
          from: 'Administracion@triada.rocks',
          from_name: 'Administracion Triada',
        },
      });
    return verification;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

// const sendVerificationEmail = async (email) => {
//   try {
//     const verification = await client.verify.v2
//       .services(serviceSid)
//       .verifications.create({
//         to: email,
//         channel: 'email',
//         channelConfiguration: {
//           template_id: 'd-7596721b285940709a118c0a42f6f0d7',
//           dynamic_template_data: {
//             verify_url: `http://localhost:4000/users/signup/email/verify?token={{twilio_code}}&email=${encodeURIComponent(email)}`,
//             // Otros datos dinámicos para la plantilla de SendGrid
//           },
//           from: 'Administracion@triada.rocks',
//           from_name: 'Administracion Triada',
//         },
//       });
//     return verification;
//   } catch (error) {
//     console.error('Error sending verification email:', error);
//     throw new Error('Failed to send verification email');
//   }
// };

module.exports = {
  getAll: async (req, res, next) => {
    try {
      let user = await Users.find(req.params);
      next({ status: 200, send: { msg: 'Usuarios', data: user } });
    } catch (error) {
      next({
        status: 404,
        send: { msg: 'Usuarios no encontrados', data: error },
      });
    }
  },

  getById: async (req, res, next) => {
    const { id } = req.params;
    try {
      let users = await Users.findById(id);
      next({
        status: 200,
        send: { msg: 'Usuario encontrado', data: users },
      });
    } catch (error) {
      next({ status: 404, send: { msg: 'Usuario no encontrado' } });
    }
  },
  post: async (req, res, next) => {
    try {
      let user = await Users.create(req.body);
      // Enviar el correo de verificación
      const email = user.email;
      const verification = await sendVerificationEmail(email);
      console.log(`Verification SID: ${verification.sid}`);

      next({ status: 201, send: { msg: 'Usuario creado', data: { user } } });
    } catch (error) {
      next({ status: 400, send: { msg: 'Usuario no creado', err: error } });
    }
  },
  put: async (req, res, next) => {
    try {
      const { id } = req.params;
      let user = await Users.findByIdAndUpdate(id, req.body);
      next({
        status: 201,
        send: { msg: 'Usuario actualizado', data: req.body },
      });
    } catch (error) {
      next({
        status: 400,
        send: { msg: 'Usuario no actualizado', data: error },
      });
    }
  },
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      let user = await Users.findByIdAndDelete(id);
      next({ status: 201, send: { msg: 'Usuario eliminado' }, data: user });
    } catch (error) {
      next({ status: 400, send: { msg: 'Usuario no eliminado', data: error } });
    }
  },
  login: async (req, res, next) => {
    try {
      let user = await Users.findOne({ email: req.body.email });
      if (user.password != req.body.password) {
        next({ status: 401, send: { msg: 'Contraseña incorrecta' } });
      }
      // delete user.password;
      let token = jwt.create(user);
      next({ status: 200, send: { msg: 'Acceso autorizado', token: token } });
    } catch (error) {
      next({ status: 401, send: { msg: 'Acceso no autorizado', err: error } });
    }
  },

  verifyEmail: async (req, res, next) => {
    const { token, email } = req.query; // Cambiado a req.query

    try {
      // Verificar el token utilizando Twilio
      const verificationCheck = await client.verify.v2
        .services(serviceSid)
        .verificationChecks.create({ to: email, code: token }); // Usar email de req.query

      if (verificationCheck.status === 'approved') {
        // Actualizar el estado del usuario en la base de datos
        let user = await Users.findOneAndUpdate(
          { email: email },
          { emailVerified: true },
          { new: true },
        );
        next({ status: 200, send: { msg: 'Email verificado', data: user } });
      } else {
        next({ status: 400, send: { msg: 'Verificación de email fallida' } });
      }
    } catch (error) {
      console.error('Error verifying email:', error);
      next({
        status: 500,
        send: { msg: 'Error interno del servidor', err: error },
      });
    }
  },
};
