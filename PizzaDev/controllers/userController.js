const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const authMiddleware = require('../middlewares/authMiddleware');

const UserController = {
  login: async (req, res) => {
    const { usuario, senha } = req.body;

    try {
      // Verificar se o usuário existe no banco de dados
      const user = await User.findOne({ usuario });

      if (!user) {
        const error = "Usuario não encontrado";
        return res.render("login", error);
      }

      // Verificar se a senha está correta
      const isPasswordMatch = await bcrypt.compare(senha, user.senha);

      if (!isPasswordMatch) {
        const error = "Credenciais invalidas";
        return res.render("login", error);
      }

      // Gerar o token de autenticação
      const token = authMiddleware.generateToken(user);
      req.session.token = token;
      res.redirect('/admin');
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Erro ao fazer login' });
    }
  },

  createUser: async (req, res) => {
    try {
      const { nomeCompleto, usuario, senha, confirmarSenha } = req.body;
      // Verifica se a senha e a confirmação de senha correspondem
      if (senha !== confirmarSenha) {
        const error = "A senha é diferente da senha de confirmação";
        return res.render('register', {error})
      }
  
      // Verifica se o usuário já existe no banco de dados
      const existingUser = await User.findOne({ where: { usuario } });
      if (existingUser) {
        const error = "Nome de usuario indisponível";
        return res.render('register', {error});
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

      res.redirect('/admin');
    } catch (error) {
      const err = ('Erro ao criar usuário: ${error}');
      return res.render('register', {err});
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll();
      console.log(users);
      res.render('users', { users });
    } catch (error) {
      console.error('Erro ao obter usuários:', error);
      res.status(500).send('Erro ao obter usuários');
    }
  },

  editUser: async (req, res) => {
    const { id } = req.params;
    const { nomeCompleto, usuario, senha, confirmarSenha } = req.body;
  
    try {
      // Verifica se a senha e a confirmação de senha correspondem
      if (senha !== confirmarSenha) {
        return res.status(400).send('A senha e a confirmação de senha não correspondem');
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
  
      res.redirect('/admin/users');
    } catch (error) {
      console.error('Erro ao editar usuário:', error);
      res.status(500).send('Erro ao editar usuário');
    }
  },

  deleteUser: async (req, res) => {
    const { id } = req.params;
  
    try {
      await User.destroy({ where: { id } });
      const msg = "Usuario deleteado com sucesso";
      res.redirect('/admin/users');
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
      res.render('users', { users });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Erro ao buscar usuários' });
    }
  },

  createUserForm: (req, res) => {
    res.render('create-user');
  },

  editUserForm: async (req, res) => {
    const { id } = req.params;

    try {
      const user = await User.findOne({where: {id}});

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      res.render('edit-user', { user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Erro ao buscar usuário' });
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
