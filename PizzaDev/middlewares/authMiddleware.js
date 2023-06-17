const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Verifica se o token de autenticação está presente nos headers da requisição
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido' });
  }

  try {
    // Verifica a validade do token e decodifica as informações
    const decoded = jwt.verify(token, 'sua_chave_secreta');

    // Adiciona as informações do usuário ao objeto de requisição
    req.user = decoded;

    // Permite que a requisição continue para o próximo middleware ou rota
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token de autenticação inválido' });
  }
};

module.exports = authMiddleware;