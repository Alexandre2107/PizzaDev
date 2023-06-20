const express = require('express');
const router = express.Router();
const PizzaController = require('../controllers/pizzaController');
const UserController = require('../controllers/userController');
const MessageController = require('../controllers/messageController');
const authMiddleware = require('../middlewares/authMiddleware');


// // Rota principal
// router.get('/', (req, res) => {
//   // Lógica para exibir a página principal
//   res.render('index');
// });

// Rotas de autenticação
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);

router.post('/', MessageController.createMessage);

// Rotas das pizzas
router.get('/', PizzaController.getAllPizzas);


module.exports = router;