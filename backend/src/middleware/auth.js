const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Acesso negado. Token não fornecido.' 
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Acesso negado' 
      });
    }

    const hasRole = roles.some(role => req.user.roles?.includes(role));
    
    if (!hasRole) {
      return res.status(403).json({ 
        success: false, 
        message: 'Permissão insuficiente' 
      });
    }

    next();
  };
};

module.exports = { authMiddleware, roleMiddleware };
