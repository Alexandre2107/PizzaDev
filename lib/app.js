const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const path = require('path');
const db = require('./config/db');

// Importar rotas
const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');
const authRouter = require('./routes/auth');
const pizzaRouter = require('./routes/pizza');
const userRouter = require('./routes/user');

const app = express();

// Configuração do Handlebars como mecanismo de visualização
app.engine(
  'hbs',
  exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
  })
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Configuração da sessão
app.use(
  session({
    secret: 'secretpizzadev',
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware para decodificar dados do formulário
app.use(express.urlencoded({ extended: true }));

// Configuração do diretório público
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do banco de dados
db.sync()
  .then(() => {
    console.log('Banco de dados conectado');
  })
  .catch((error) => {
    console.error('Erro ao conectar ao banco de dados:', error);
  });

// Rotas
app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/', authRouter);
app.use('/pizza', pizzaRouter);
app.use('/user', userRouter);

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});