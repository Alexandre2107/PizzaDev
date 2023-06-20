const Pizza = require('../models/pizzaModel');


const PizzaController = {

    getAllPizzas: async (req, res) => {
        try {
            const pizzas = await Pizza.findAll();
            res.render('index', { listaPizzas: pizzas , layout: 'main'});
        } catch (error) {
            const mensagemErro = ('Erro ao obter pizzas: ', error);
            res.status(500).send('Erro ao obter pizzas');
        }
    },

    getPizzaById: async (req, res) => {
        const { id } = req.params;

        try {
            const pizza = await Pizza.findById(id);

            if (!pizza) {
                throw {error: 'Pizza não encontrada'};
            }

            res.status(200).json(pizza);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Erro ao buscar pizza por ID' });
        }
    },

    createPizza: async (req, res) => {
        const { nome, descricao, precoBrotinho, precoMedia, precoGrande, foto } = req.body;

        try {

            if (nome.length <= 2){
                throw {error: "Nome muito curto"};
              }
        
              if (descricao.length <= 2){
                throw {error: "Descrição muito curta"};
              }

            await Pizza.create({
                nome,
                descricao,
                precoBrotinho,
                precoMedia,
                precoGrande,
                foto
            });
            res.redirect('/admin/pizzas');
        } catch (error) {
            const mensagemErro = ('Erro ao criar pizza: '+ error.error);
            res.render('cadastrar-pizza', {mensagemErro});
        }
    },

    updatePizza: async (req, res) => {
        const { id } = req.params;
        const { nome, descricao, precoBrotinho, precoMedia, precoGrande, foto } = req.body;

        console.log(req.body);

        try {
            if (nome.length <= 2){
                throw {error: "Nome muito curto"};
              }
        
              if (descricao.length <= 2){
                throw {error: "Descrição muito curta"};
              }

            await Pizza.update(
                {
                    nome,
                    descricao,
                    precoBrotinho,
                    precoMedia,
                    precoGrande,
                    foto
                },
                {
                    where: { id },
                }
            );
            res.redirect('/admin/pizzas');
        } catch (error) {
            const mensagemErro = ('Erro ao editar pizza: ' + error.error);
            res.render('editar-pizza', {layout: 'admin', mensagemErro});
        }
    },

    deletePizza: async (req, res) => {
        const { id } = req.params;

        try {
            await Pizza.destroy({ where: { id } });
            res.redirect('/admin/pizzas');
        } catch (error) {
            const mensagemErro = ('Erro ao deletar pizza' + error.message);
            res.render('indexAdmin', {layout: 'admin', })
        }
    },

    getAllPizzasAdmin: async (req, res) => {
        try {
          const pizzas = await Pizza.findAll();
    
          res.render('indexAdmin', { listaPizzas: pizzas , layout: 'admin' });
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: 'Erro ao buscar pizzas' });
        }
      },

      createPizzaForm: (req, res) => {
        res.render('cadastrar-pizza', {layout: 'admin'});
      },
    
      editPizzaForm: async (req, res) => {
        const { id } = req.params;
    
        try {
          const pizza = await Pizza.findOne({where: {id}});
    
          if (!pizza) {
            return res.status(404).json({ message: 'Pizza não encontrada' });
          }
    
          res.render('editar-pizza', { layout: 'admin', pizza});
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: 'Erro ao buscar pizza' });
        }
      },
}

module.exports = PizzaController;