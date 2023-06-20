const Pizza = require('../models/pizzaModel');


const PizzaController = {

    getAllPizzas: async (req, res) => {
        try {
            const pizzas = await Pizza.findAll();
            res.render('index', { listaPizzas: pizzas , layout: 'main'});
        } catch (error) {
            const pizzaErro = ('Erro ao obter pizzas: ', error);
            res.render('index', pizzaErro);
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
            const mensagemSucesso = ('Pizza cadastrada com sucesso!');
            res.render('cadastrar-pizza', {layout: 'admin', mensagemSucesso});
        } catch (error) {
            const mensagemErro = ('Erro ao criar pizza: '+ error.error);
            res.render('cadastrar-pizza', {layout: 'admin', mensagemErro});
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
            const pizza = await Pizza.findOne({where: {id}});
            const mensagemSucesso = ('Pizza editada com sucesso!')
            res.render('editar-pizza', {layout: 'admin', mensagemSucesso: mensagemSucesso, pizza});
        } catch (error) {
            const pizza = await Pizza.findOne({where: {id}});
            const mensagemErro = ('Erro ao editar pizza: ' + error.error);
            res.render('editar-pizza', {layout: 'admin', mensagemErro, pizza});
        }
    },

    deletePizza: async (req, res) => {
        const { id } = req.params;

        try {
            await Pizza.destroy({ where: { id } });
            const listaPizzas = await Pizza.findAll();
            const mensagemSucesso = 'Pizza deletada com sucesso!';
            res.render('indexAdmin', {layout: 'admin', mensagemSucesso, listaPizzas});
        } catch (error) {
            const listaPizzas = await Pizza.findAll();
            const mensagemErro = ('Erro ao deletar pizza' + error.message);
            res.render('indexAdmin', {layout: 'admin', mensagemErro, listaPizzas})
        }
    },

    getAllPizzasAdmin: async (req, res) => {
        try {
          const pizzas = await Pizza.findAll();
    
          res.render('indexAdmin', { listaPizzas: pizzas , layout: 'admin' });
        } catch (error) {
          const mensagemErro = 'Erro ao buscar pizzas: ' + error;
          res.render('indexAdmin', { layout: 'admin' , mensagemErro});
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
            throw {error: 'Pizza não encontrada'};
          }

          res.render('editar-pizza', { layout: 'admin', pizza});
        } catch (error) {
          const pizzas = await Pizza.findAll();
          const mensagemErro = 'Erro ao editar pizza: ' + error.error;
          res.render('indexAdmin', { layout: 'admin' , mensagemErro, listaPizzas: pizzas});
        }
      },
}

module.exports = PizzaController;