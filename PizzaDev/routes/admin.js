const express = require('express');
const router = express.Router();
const PizzaController = require('../controllers/pizzaController');
const UserController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rota principal do painel administrativo
router.get('/', authMiddleware, (req, res) => {
  // Lógica para exibir a página principal do painel administrativo
  res.render('admin/index');
});

// Rotas de gerenciamento de pizzas
router.get('/pizzas', authMiddleware, PizzaController.getAllPizzasAdmin);
router.get('/pizzas/create', authMiddleware, PizzaController.createPizzaForm);
router.post('/pizzas', authMiddleware, PizzaController.createPizza);
router.get('/pizzas/edit/:id', authMiddleware, PizzaController.editPizzaForm);
router.put('/pizzas/:id', authMiddleware, PizzaController.updatePizza);
router.delete('/pizzas/:id', authMiddleware, PizzaController.deletePizza);

// Rotas de gerenciamento de usuários
router.get('/users', authMiddleware, UserController.getAllUsersAdmin);
router.get('/users/create', authMiddleware, UserController.createUserForm);
router.post('/users', authMiddleware, UserController.createUser);
router.get('/users/edit/:id', authMiddleware, UserController.editUserForm);
router.put('/users/:id', authMiddleware, UserController.editUser);
router.delete('/users/:id', authMiddleware, UserController.deleteUser);

module.exports = router;