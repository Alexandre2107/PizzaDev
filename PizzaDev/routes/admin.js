const express = require('express');
const router = express.Router();
const PizzaController = require('../controllers/pizzaController');
const UserController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rota principal do painel administrativo
router.get('/', (req, res) => {
  // Lógica para exibir a página principal do painel administrativo
  if(req.session.token){
    res.render('admin');
  } else {
    res.redirect('/login');
  }
});

// Rotas de gerenciamento de pizzas
router.get('/pizzas', authMiddleware.authMiddleware, PizzaController.getAllPizzasAdmin);
router.get('/pizzas/create', authMiddleware.authMiddleware, PizzaController.createPizzaForm);
router.post('/pizzas', authMiddleware.authMiddleware, PizzaController.createPizza);
router.get('/pizzas/edit/:id', authMiddleware.authMiddleware, PizzaController.editPizzaForm);
router.put('/pizzas/:id', authMiddleware.authMiddleware, PizzaController.updatePizza);
router.delete('/pizzas/:id', authMiddleware.authMiddleware, PizzaController.deletePizza);

// Rotas de gerenciamento de usuários
router.get('/users', authMiddleware.authMiddleware, UserController.getAllUsersAdmin);
router.get('/users/create', authMiddleware.authMiddleware, UserController.createUserForm);
router.post('/users', authMiddleware.authMiddleware, UserController.createUser);
router.get('/users/edit/:id', authMiddleware.authMiddleware, UserController.editUserForm);
router.put('/users/:id', authMiddleware.authMiddleware, UserController.editUser);
router.delete('/users/:id', authMiddleware.authMiddleware, UserController.deleteUser);

module.exports = router;