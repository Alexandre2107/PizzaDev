const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const authMiddleware = require('../middlewares/authMiddleware');

const UserController = {
  login: async (req, res) => {
    const { usuario, senha } = req.body;
    try {
      
      // Verificar se o usuário existe no banco de dados
      const user = await User.findOne({where: {usuario} });
      if (!user) {
        throw {error: "Usuario não encontrado"};
      }

      // Verificar se a senha está correta
      const isPasswordMatch = await bcrypt.compare(senha, user.senha);

      if (!isPasswordMatch) {
        throw {error: "Credenciais invalidas"};
      }

      // Gerar o token de autenticação
      const token = authMiddleware.generateToken(user);
      req.session.token = token;
      res.redirect('/admin/pizzas');
    } catch (error) {
      const mensagemErro = ('Erro ao fazer login: ' + error.error);
      return res.render("login", {mensagemErro});
    }
  },

  createUser: async (req, res) => {
    const { nomeCompleto, usuario, senha, confirmarSenha } = req.body;
    try {
      
      // Verifica se a senha e a confirmação de senha correspondem
      if (nomeCompleto.length <= 2){
        throw {error: "Nome muito curto"};
      }

      if (usuario.length <= 2){
        throw {error: "Usuario muito curto"};
      }

      if (senha.length <= 2){
        throw {error: "Senha muito curta"};
      }

      if (senha !== confirmarSenha) {
        throw {error: "A senha é diferente da senha de confirmação"};
      }
  
      // Verifica se o usuário já existe no banco de dados
      const existingUser = await User.findOne({ where: { usuario } });
      if (existingUser) {
        throw {error: "Nome de usuario indisponível"};
      }
  
      // Criptografa a senha
      const hashedPassword = await bcrypt.hash(senha, 10);
  
      // Cria o usuário no banco de dados
      const user = await User.create({
        nomeCompleto,
        usuario,
        senha: hashedPassword,
      });

      const token = authMiddleware.generateToken(user);

      req.session.token = token;

      res.redirect('/admin/pizzas');
    } catch (error) {
      const mensagemErro = ('Erro ao criar usuário: ' + error.error);
      return res.render('cadastrar-usuario', {mensagemErro});
    }
  },

  editUser: async (req, res) => {
    const { id } = req.params;
      const { nomeCompleto, usuario, senha, confirmarSenha } = req.body;
    try {
      
      if (nomeCompleto.length <= 2){
        throw {error: "Nome muito curto"};
      }

      if (usuario.length <= 2){
        throw {error: "Usuario muito curto"};
      }

      if (senha.length <= 2){
        throw {error: "Senha muito curta"};
      }

      if (senha !== confirmarSenha) {
        throw {error: "A senha é diferente da senha de confirmação"};
      }

      const existingUser = await User.findOne({ where: { usuario } });
      if (existingUser && existingUser.id != id) {
        throw {error: "Nome de usuario indisponível"};
      }

      // Criptografa a nova senha
      const hashedPassword = await bcrypt.hash(senha, 10);
  
      // Atualiza o usuário no banco de dados
      await User.update(
        {
          nomeCompleto,
          usuario,
          senha: hashedPassword,
        },
        {
          where: { id },
        }
      );
      const mensagemSucesso = 'Usuario editado com sucesso!';
      const user = await User.findOne({where: {id}});
      res.render('editar-usuario', {layout: 'admin', mensagemSucesso: mensagemSucesso, usuario: user});
    } catch (error) {
      const user = await User.findOne({where: {id}});
      const mensagemErro = ('Erro ao editar usuário: ' + error.error);
      res.render('editar-usuario', {layout: 'admin', mensagemErro: mensagemErro, usuario: user});
    }
  },

  deleteUser: async (req, res) => {
    const { id } = req.params;
  
    try {
      await User.destroy({ where: { id } });
      const mensagemSucesso = "Usuario deleteado com sucesso";
      const listaUsuarios = await User.findAll();
      res.render('usuarios', {layout: 'admin', mensagemSucesso, listaUsuarios});
    } catch (error) {
      const listaUsuarios = await User.findAll();
      const mensagemErro = 'Erro ao excluir usuário:' + error;
      res.render('usuarios', {layout: 'admin', mensagemErro, listaUsuarios});
    }
  },

  logout: (req, res) => {
    // Limpar dados de autenticação
    req.session.destroy();
    res.redirect('/login');
  },

  getAllUsersAdmin: async (req, res) => {
    try {
      const listaUsuarios = await User.findAll();
      res.render('usuarios', { layout: 'admin', listaUsuarios });
    } catch (error) {
      res.render('usuarios', { layout: 'admin', mensagemErro: 'Erro ao buscar usuários' });
    }
  },

  createUserForm: (req, res) => {
    res.render('cadastrar-usuario', {layout: 'admin'});
  },

  createUserAdmin: async (req, res) => {
    try {
      const { nomeCompleto, usuario, senha, confirmarSenha } = req.body;
      // Verifica se a senha e a confirmação de senha correspondem
      if (nomeCompleto.length <= 2){
        throw {error: "Nome muito curto"};
      }

      if (usuario.length <= 2){
        throw {error: "Usuario muito curto"};
      }

      if (senha.length <= 2){
        throw {error: "Senha muito curta"};
      }

      if (senha !== confirmarSenha) {
        throw {error: "A senha é diferente da senha de confirmação"};
      }

      const existingUser = await User.findOne({ where: { usuario } });
      if (existingUser) {
        throw {error: "Nome de usuario indisponível"};
      }
  
      // Criptografa a senha
      const hashedPassword = await bcrypt.hash(senha, 10);
  
      // Cria o usuário no banco de dados
      const user = await User.create({
        nomeCompleto,
        usuario,
        senha: hashedPassword,
      });

      const token = authMiddleware.generateToken(user);

      req.session.token = token;
      const listaUsuarios = await User.findAll();
      const mensagemSucesso = ('Usuario criado com sucesso!');
      res.render('cadastrar-usuario', {layout: 'admin', mensagemSucesso, listaUsuarios});
    } catch (error) {
      const mensagemErro = ('Erro ao criar usuário:' + error);
      const listaUsuarios = await User.findAll();
      return res.render('cadastrar-usuario', {layout: 'admin', mensagemErro, listaUsuarios});
    }
  },


  editUserForm: async (req, res) => {
    const { id } = req.params;

    try {
      const usuario = await User.findOne({where: {id}});

      if (!usuario) {
        throw {error: 'Usuário não encontrado'};
      }

      res.render('editar-usuario', { layout: 'admin', usuario });
    } catch (error) {
      const mensagemErro = ('Erro ao buscar usuário: ' + error)
      res.render('editar-usuario', { layout: 'admin', mensagemErro });
    }
  }
};

module.exports = UserController;
