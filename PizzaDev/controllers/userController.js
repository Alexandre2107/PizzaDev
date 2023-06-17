const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const UserController = {
  login: async (req, res) => {
    const { username, password } = req.body;

    try {
      // Verificar se o usuário existe no banco de dados
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      // Verificar se a senha está correta
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      // Gerar o token de autenticação
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      res.status(200).json({ token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Erro ao fazer login' });
    }
  },

  createUser: async (req, res) => {
    const { nomeCompleto, usuario, senha, confirmarSenha } = req.body;
  
    try {
      // Verifica se a senha e a confirmação de senha correspondem
      if (senha !== confirmarSenha) {
        return res.status(400).send('A senha e a confirmação de senha não correspondem');
      }
  
      // Verifica se o usuário já existe no banco de dados
      const existingUser = await User.findOne({ where: { usuario } });
      if (existingUser) {
        return res.status(400).send('O usuário já está cadastrado');
      }
  
      // Criptografa a senha
      const hashedPassword = await bcrypt.hash(senha, 10);
  
      // Cria o usuário no banco de dados
      await User.create({
        nomeCompleto,
        usuario,
        senha: hashedPassword,
      });
  
      res.status(201).send('Usuário criado com sucesso');
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      res.status(500).send('Erro ao criar usuário');
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll();
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
      const users = await User.find();

      res.render('admin', { users });
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
      const user = await User.findById(id);

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
