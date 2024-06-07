function authenticateRoleClient(req, res, next) {
  if (!req.user) {
    // Verificar si req.user existe (significa que authenticateToken se ejecutó antes)
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.user.role === 'cliente') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden - Not a client' });
  }
}

module.exports = authenticateRoleClient;
