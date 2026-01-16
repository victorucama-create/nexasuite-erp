const jwt = require('jsonwebtoken');

// Mock database (em produção, use PostgreSQL)
const users = [
  {
    id: 1,
    name: 'Super Admin',
    email: 'admin@nexasuite.com',
    password: 'Nexa@2025Master!', // Em produção, use bcrypt
    roles: ['SUPER_ADMIN'],
    permissions: ['*'],
    avatar: 'SA'
  }
];

const generateTokens = (user) => {
  const token = jwt.sign(
    { 
      userId: user.id,
      email: user.email,
      roles: user.roles 
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
    { expiresIn: '7d' }
  );

  return { token, refreshToken };
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Demo credentials
    if (email === 'admin@nexasuite.com' && password === 'Nexa@2025Master!') {
      const user = users[0];
      const { token, refreshToken } = generateTokens(user);

      res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          roles: user.roles,
          permissions: user.permissions,
          avatar: user.avatar
        },
        token,
        refreshToken
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro no servidor'
    });
  }
};

exports.register = async (req, res) => {
  // Implementar registro
  res.status(501).json({ message: 'Em desenvolvimento' });
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'Token não fornecido' });
    }

    const decoded = jwt.verify(
      refreshToken, 
      process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key'
    );

    const user = users.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Usuário não encontrado' });
    }

    const { token: newToken, refreshToken: newRefreshToken } = generateTokens(user);

    res.json({
      success: true,
      token: newToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token inválido ou expirado'
    });
  }
};

exports.getProfile = async (req, res) => {
  // Pega usuário do token
  const userId = req.user?.userId;
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      permissions: user.permissions,
      avatar: user.avatar
    }
  });
};

exports.updateProfile = async (req, res) => {
  // Atualizar perfil
  res.status(501).json({ message: 'Em desenvolvimento' });
};

exports.changePassword = async (req, res) => {
  // Alterar senha
  res.status(501).json({ message: 'Em desenvolvimento' });
};
