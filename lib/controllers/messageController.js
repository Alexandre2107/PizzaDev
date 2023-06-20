const Message = require('../models/messageModel.js')

const MessageController = {
    getAllMessages: async (req, res) => {
        try{
            const messages = await Message.findAll();
            res.render('mensagens', {layout: 'admin', listaMensagens: messages});
        } catch (error) {
            const mensagemErro = ('Erro ao obter mensagens:', error);
            res.render('mensagens', {mensagemErro});
        }
    },

    createMessage: async (req, res) => {
        const {titulo, nome, mensagem, email} = req.body;
        try{

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
            const mensagemSucesso = "Mensagem enviada!";
            res.render('index', {mensagemSucesso});
        } catch (error){
            const mensagemErro = ('Não foi possível enviar a mensagem: ' + error.error);
            res.render('index', {mensagemErro});
        }
    },

    deleteMessage: async (req, res) => {
        const { id } = req.params;
  
        try {
          await Message.destroy({ where: { id } });
          const mensagens = await Message.findAll();
          const mensagemSucesso = 'Mensagem deletada com sucesso!';
          res.render('mensagens', {layout: 'admin', mensagemSucesso, mensagens});
        } catch (error) {
            const mensagemErro = ('Não foi possível deletar a mensagem: ' + error);
            res.render('mensagens', {layout: 'admin', mensagemErro, mensagens});
        }
    }
}

module.exports = MessageController;