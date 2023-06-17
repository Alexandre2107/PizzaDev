const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Rota para exibir todos os usuários
router.get('/', UserController.getAllUsers);

// Rota para exibir os detalhes de um usuário específico
router.get('/:id', UserController.getUserById);

module.exports = router;