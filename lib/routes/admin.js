const express = require('express');
const router = express.Router();
const exphbs = require('express-handlebars');
const PizzaController = require('../controllers/pizzaController');
const UserController = require('../controllers/userController');
const MessageController = require('../controllers/messageController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rota principal do painel administrativo
router.get('/', authMiddleware.authMiddleware, (req, res) => {
  // Lógica para exibir a página principal do painel administrativo
  try {
    res.redirect('/admin/pizzas');
  }
  catch (erro){
    res.redirect('/login');
  }
});

// Rotas de gerenciamento de pizzas
router.get('/pizzas', authMiddleware.authMiddleware, PizzaController.getAllPizzasAdmin);
router.get('/cadastrar-pizza', authMiddleware.authMiddleware, PizzaController.createPizzaForm);
router.post('/cadastrar-pizza', authMiddleware.authMiddleware, PizzaController.createPizza);
router.get('/editar-pizza/:id', authMiddleware.authMiddleware, PizzaController.editPizzaForm);
router.post('/editar-pizza/:id', authMiddleware.authMiddleware, PizzaController.updatePizza);
router.put('/pizzas/:id', authMiddleware.authMiddleware, PizzaController.updatePizza);
router.get('/delete/:id', authMiddleware.authMiddleware, PizzaController.deletePizza);

// Rotas de gerenciamento de usuários
router.get('/usuarios', authMiddleware.authMiddleware, UserController.getAllUsersAdmin);
router.get('/cadastrar-usuario', authMiddleware.authMiddleware, UserController.createUserForm);
router.post('/cadastrar-usuario', authMiddleware.authMiddleware, UserController.createUserAdmin);
router.get('/editar-usuario/:id', authMiddleware.authMiddleware, UserController.editUserForm);
router.post('/editar-usuario/:id', authMiddleware.authMiddleware, UserController.editUser);
router.get('/usuarios/delete/:id', authMiddleware.authMiddleware, UserController.deleteUser);

router.get('/mensagens', authMiddleware.authMiddleware, MessageController.getAllMessages);
router.get('/message/:id', authMiddleware.authMiddleware, MessageController.deleteMessage)

module.exports = router;