const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ erro: 'Token não informado' });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ erro: 'JWT_SECRET não configurado' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ erro: 'Token inválido ou expirado' });
  }
}

function requireAdmin(req, res, next) {
  const perfil = String(req.user?.perfil || '').trim().toUpperCase();

  if (!perfil) {
    return res.status(403).json({ erro: 'Perfil não informado no token' });
  }

  const isAdmin = perfil === 'ADM' || perfil === 'ADMIN' || perfil.includes('ADMIN');

  if (!isAdmin) {
    return res.status(403).json({ erro: 'Apenas ADM pode criar paciente e profissional' });
  }

  return next();
}

module.exports = {
  authenticateToken,
  requireAdmin,
};
