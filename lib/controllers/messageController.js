const Message = require('../models/messageModel.js')

const MessageController = {
    getAllMessages: async (req, res) => {
        try{
            const messages = await Message.findAll();
            res.render('messages', {messages});
        } catch (error) {
            console.error('Erro ao obter mensagens:', error);
            res.status(500).send('Erro ao obter mensagens');
        }
    },

    createMessage: async (req, res) => {
        try{
            const {titulo, mensagem, email} = req.body;

            const msg = await Message.create({
                titulo,
                mensagem,
                email
            });
        } catch (error){
            res.status(500).send("Erro ao criar mensagem");
        }
    },

    deleteMessage: async (req, res) => {
        const { id } = req.params;
  
        try {
          await Message.destroy({ where: { id } });
          res.redirect('/admin/message');
        } catch (error) {
            res.redirect('/admin/message', error);
        }
    }
}

module.exports = MessageController;