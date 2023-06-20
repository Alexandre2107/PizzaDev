const Message = require('../models/messageModel.js')

const MessageController = {
    getAllMessages: async (req, res) => {
        try{
            const messages = await Message.findAll();
            res.render('mensagens', {layout: 'admin', listaMensagens: messages});
        } catch (error) {
            console.error('Erro ao obter mensagens:', error);
            res.status(500).send('Erro ao obter mensagens');
        }
    },

    createMessage: async (req, res) => {
        try{
            const {titulo, nome, mensagem, email} = req.body;


            if (nome.length <= 2){
                throw {error: "Nome muito curto"};
              }
        
              if (titulo.length <= 2){
                throw {error: "Descrição muito curta"};
              }

              if (email.length <= 2){
                throw {error: "Email muito curto"};
              }
        
              if (mensagem.length <= 2){
                throw {error: "Mensagem muito curta"};
              }

            const msg = await Message.create({
                nome,
                titulo,
                mensagem,
                email
            });
            res.redirect('/#contact');
        } catch (error){
            const mensagemErro = ('Não foi possível enviar a mensagem: ' + error.error);
            res.render('index', {mensagemErro});
        }
    },

    deleteMessage: async (req, res) => {
        const { id } = req.params;
  
        try {
          await Message.destroy({ where: { id } });
          res.redirect('/admin/mensagens');
        } catch (error) {
            res.redirect('/admin/mensagens', error);
        }
    }
}

module.exports = MessageController;