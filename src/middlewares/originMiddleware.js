const allowedOrigin = process.env.URL_ALLOW_ORIGIN; // Asegúrate de incluir el protocolo (https://)

function originMiddleware(req, res, next) {
  const origin = req.headers.origin;

  if (origin === allowedOrigin) {
    // La solicitud proviene del dominio permitido, así que la dejamos pasar
    next();
  } else {
    // La solicitud proviene de un dominio no permitido, enviamos un error
    res.status(403).json({ error: 'Acceso no permitido' });
  }
}

module.exports = originMiddleware;
