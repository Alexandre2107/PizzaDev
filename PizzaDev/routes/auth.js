const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Rota de exibição do formulário de login
router.get('/login', (req, res) => {
  // Lógica para exibir o formulário de login
  res.render('login');
});

router.get('/register', (req, res) => {
  // Lógica para exibir o formulário de cadastro
  res.render('register');
});

// Rota de autenticação de usuário
router.post('/login', UserController.login);

// Rota de logout
router.get('/logout', UserController.logout);

router.post('/register', UserController.createUser);

module.exports = router;