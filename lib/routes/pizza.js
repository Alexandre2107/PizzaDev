const express = require('express');
const router = express.Router();
const PizzaController = require('../controllers/pizzaController');

// Rota para exibir todas as pizzas
router.get('/', PizzaController.getAllPizzas);

// Rota para exibir os detalhes de uma pizza específica
router.get('/:id', PizzaController.getPizzaById);

module.exports = router;