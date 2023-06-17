const Pizza = require('../models/pizzaModel');


const PizzaController = {

    getAllPizzas: async (req, res) => {
        try {
            const pizzas = await Pizza.findAll();
            res.render('index', { pizzas });
        } catch (error) {
            console.error('Erro ao obter pizzas:', error);
            res.status(500).send('Erro ao obter pizzas');
        }
    },

    getPizzaById: async (req, res) => {
        const { id } = req.params;

        try {
            const pizza = await Pizza.findById(id);

            if (!pizza) {
                return res.status(404).json({ message: 'Pizza não encontrada' });
            }

            res.status(200).json(pizza);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Erro ao buscar pizza por ID' });
        }
    },

    createPizza: async (req, res) => {
        const { nome, descricao, precoBrotinho, precoMedia, precoGrande } = req.body;

        try {
            await Pizza.create({
                nome,
                descricao,
                precoBrotinho,
                precoMedia,
                precoGrande,
            });
            res.redirect('/admin');
        } catch (error) {
            console.error('Erro ao criar pizza:', error);
            res.status(500).send('Erro ao criar pizza');
        }
    },

    updatePizza: async (req, res) => {
        const { id } = req.params;
        const { nome, descricao, precoBrotinho, precoMedia, precoGrande } = req.body;

        try {
            await Pizza.update(
                {
                    nome,
                    descricao,
                    precoBrotinho,
                    precoMedia,
                    precoGrande,
                },
                {
                    where: { id },
                }
            );
            res.redirect('/admin');
        } catch (error) {
            console.error('Erro ao editar pizza:', error);
            res.status(500).send('Erro ao editar pizza');
        }
    },

    deletePizza: async (req, res) => {
        const { id } = req.params;

        try {
            await Pizza.destroy({ where: { id } });
            res.redirect('/admin');
        } catch (error) {
            console.error('Erro ao excluir pizza:', error);
            res.status(500).send('Erro ao excluir pizza');
        }
    },

    getAllPizzasAdmin: async (req, res) => {
        try {
          const pizzas = await Pizza.find();
    
          res.render('admin', { pizzas });
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: 'Erro ao buscar pizzas' });
        }
      },

      createPizzaForm: (req, res) => {
        res.render('create-pizza');
      },
    
      editPizzaForm: async (req, res) => {
        const { id } = req.params;
    
        try {
          const pizza = await Pizza.findById(id);
    
          if (!pizza) {
            return res.status(404).json({ message: 'Pizza não encontrada' });
          }
    
          res.render('edit-pizza', { pizza });
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: 'Erro ao buscar pizza' });
        }
      },
}

module.exports = PizzaController;