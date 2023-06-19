const express = require('express');
const router = express.Router();
const PizzaController = require('../controllers/pizzaController');
const UserController = require('../controllers/userController');
const MessageController = require('../controllers/messageController');
const authMiddleware = require('../middlewares/authMiddleware');


// Rota principal
router.get('/', (req, res) => {
  // Lógica para exibir a página principal
  res.render('index');
});

// Rotas de autenticação
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);

router.post('/message', MessageController.createMessage);

// Rotas das pizzas
router.get('/pizzas', PizzaController.getAllPizzas);
router.get('/pizzas/:id', PizzaController.getPizzaById);
router.post('/pizzas', authMiddleware.authMiddleware, PizzaController.createPizza);
router.put('/pizzas/:id', authMiddleware.authMiddleware, PizzaController.updatePizza);
router.delete('/pizzas/:id', authMiddleware.authMiddleware, PizzaController.deletePizza);

// Rotas dos usuários
router.get('/users', authMiddleware.authMiddleware, UserController.getAllUsers);
router.post('/users', UserController.createUser);
router.put('/users/:id', authMiddleware.authMiddleware, UserController.editUser);
router.delete('/users/:id', authMiddleware.authMiddleware, UserController.deleteUser);

module.exports = router;