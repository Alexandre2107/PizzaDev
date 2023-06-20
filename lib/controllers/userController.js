const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const authMiddleware = require('../middlewares/authMiddleware');

const UserController = {
  login: async (req, res) => {
    try {
      const { usuario, senha } = req.body;
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

  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll();
      console.log(users);
      res.render('usuarios', { users });
    } catch (error) {
      const mensagemErro = ('Erro ao obter usuários:', error);
      return res.render('usuarios', {mensagemErro});
    }
  },

  editUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { nomeCompleto, usuario, senha, confirmarSenha } = req.body;

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
  
      res.redirect('/admin/usuarios');
    } catch (error) {
      const mensagemErro = ('Erro ao editar usuário: ' + error.error);
      res.render('editar-usuario', {layout: 'admin', mensagemErro: mensagemErro});
    }
  },

  deleteUser: async (req, res) => {
    const { id } = req.params;
  
    try {
      await User.destroy({ where: { id } });
      const msg = "Usuario deleteado com sucesso";
      res.redirect('/admin/usuarios');
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      res.status(500).send('Erro ao excluir usuário');
    }
  },

  logout: (req, res) => {
    // Limpar dados de autenticação
    req.session.destroy();
    res.redirect('/login');
  },

  getAllUsersAdmin: async (req, res) => {
    try {
      const users = await User.findAll();
      console.log(users);
      res.render('usuarios', { layout: 'admin', listaUsuarios: users });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Erro ao buscar usuários' });
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

      res.redirect('/admin/usuarios');
    } catch (error) {
      const err = ('Erro ao criar usuário:' + error);
      return res.render('cadastrar-usuario', {layout: 'admin', mensagemErro: err});
    }
  },


  editUserForm: async (req, res) => {
    const { id } = req.params;

    try {
      const user = await User.findOne({where: {id}});

      if (!user) {
        throw {error: 'Usuário não encontrado'};
      }

      res.render('editar-usuario', { layout: 'admin', usuario: user });
    } catch (error) {
      const mensagemErro = ('Erro ao buscar usuário: ' + error)
      res.render('editar-usuario', { layout: 'admin', mensagemErro });
    }
  },

  getUserById: async (req, res) => {
    const { id } = req.params;

    try {
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      res.json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Erro ao buscar usuário' });
    }
  },
};

module.exports = UserController;
