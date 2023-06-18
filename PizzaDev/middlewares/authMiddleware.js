const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const generateSecretKey = () => {
  const length = 32;
  return crypto.randomBytes(length).toString('hex');
}

const secretKey = '123123';

const generateToken = (user) => {
  const payload = {
    id: user.id,
    usuario: user.usuario,
  }

  const options = {
    expiresIn: '1h',
  }

  return jwt.sign(payload, secretKey, options);
}

const authMiddleware = (req, res, next) => {
  // Verifica se o token de autenticação está presente nos headers da requisição
  const token = req.session.token;

  if (!token) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido' });
  }

  try {
    // Verifica a validade do token e decodifica as informações
    const decoded = jwt.verify(token, secretKey);

    // Adiciona as informações do usuário ao objeto de requisição
    req.user = decoded;

    // Permite que a requisição continue para o próximo middleware ou rota
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token de autenticação inválido' });
  }
};

module.exports = {
  generateToken,
  authMiddleware
}