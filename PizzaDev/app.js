const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require("path");
const db = require('./db');
const { userInfo } = require('os');

const app = express();
const port = 3000;

// Configuração do Handlebars como template engine
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.set("views", "./views");

// Middleware para análise do corpo das requisições
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Middleware para gerenciar sessões e cookies
app.use(cookieParser());
app.use(session({
  secret: "thisIsMySecretKey",
  saveUninitialized: true,
  resave: false,
  name: "Cookie de Sessao",
  cookie: { maxAge: 1000 * 60 * 3 }, // 3 minutos
}));

// Qualquer requisição de qualquer tipo GET, POST, PUT e DELETE...
app.use("*", async function(req, res, next) {
  if (!req.session.usuario && req.cookies.token) {
      const resultado = await db.query("SELECT * FROM usuarios WHERE token = ?", [req.cookies.token]);
      if (resultado.length) {
          req.session.usuario = resultado[0];
      }
  }
  next();
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", async (req, res) => {
  res.render("index", {
    layout: "main",
    tituloPagina: "Pizza Dev"
  })
});

app.get("/admin", async(req, res) => {
  if (!req.session.usuario) {
    res.redirect("/login");
    return;
} 

  const buscaPizzas = await db.query("SELECT * FROM pizza");

 res.render("indexAdmin", {
  layout: "admin",
  listaPizzas: buscaPizzas,  
  tituloPagina: "Nossas Pizzas | Administração | Pizza DEV"
 });
});

app.get("/login", async (req, res) => {
  res.render("login", {
      tituloPagina: "Login",
  });
});

app.post("/login", async (req, res) => {
  const {usuario, senha} = req.body;
  const resultado = await db.query("SELECT * FROM usuarios WHERE email = ? AND senha = ?", [usuario, senha]);
  console.log(resultado.length);


  if (resultado.length > 0) {
     req.session.usuario = resultado[0];
      res.redirect("/admin");
      return;
  }

  res.render("login", {
      tituloPagina: "Login",
      titulo: "Login",
      layout: "main",
      mensagemErro: "Usuario/Senha Incorretas"
  });
});

app.get("/logout", async (req, res) => {
  res.cookie("token", "");
  req.session.destroy();
  res.redirect("/login");
});

app.get("/cadastrar-usuario", async (req, res) => {
  res.render("cadastrar-usuario", {
    tituloPagina: "Cadastrar Usuario",
  });
});

app.post("/cadastrar-usuario", async (req, res) => {
  const nomeCompleto = req.body.nomeCompleto;
  const email = req.body.usuario;
  const senha = req.body.senha;
  const confirmacaoSenha = req.body.confirmacaoSenha;

  if (senha != confirmacaoSenha) {
    res.render("cadastrar-usuario", {
      tituloPagina: "Cadastro",
      titulo: "Cadastro",
      mensagemErro: "Senhas não coincidem"
    });
    return;
  }

  let resultado = await db.query("SELECT * FROM usuarios WHERE email = ?", [
    email,
  ]);
  console.log(resultado);
  console.log(resultado.length);

  if (resultado.length > 0) {
    res.render("cadastrar-usuario", {
      tituloPagina: "Cadastro",
      titulo: "Cadastro",
      mensagemErro: "Usuário/Senha já existentes!",
    });
  } else {
    resultado = await db.query(
      "INSERT INTO usuarios(nome, email, senha) VALUES(?, ?, ?)",
      [nomeCompleto, email, senha]
    );

    res.redirect("/admin");
    return;
  }
});

app.get("/cadastrar-pizza", async (req, res) => {
  res.render("cadastrar-pizza", {
    tituloPagina: "Cadastrar Pizza",
    layout: "admin"
  });
});

app.post("/cadastrar-pizza", async (req, res) => {

  const nomePizza = req.body.nomePizza.toUpperCase();
  const descricao = req.body.descricao;
  const precoBrotinho = req.body.precoBrotinho;
  const precoMedia = req.body.precoMedia;
  const precoGrande = req.body.precoGrande;
  const foto = req.body.foto;
  const pizza = await db.query("SELECT nomePizza FROM pizza WHERE nomePizza = ?", [
    nomePizza
  ])

  console.log(pizza)

  if (pizza.length > 0) {
    res.render("cadastrar-pizza", {
      tituloPagina: "Cadastro Pizza",
      mensagemErro: "Pizza Já Existe!",
      layout: "admin"
    });
  } else {
    resultado = await db.query(
      "INSERT INTO pizza (nomePizza, descricao, precoBrotinho, precoMedia, precoGrande, foto) VALUES (?, ?, ?, ?, ?, ?)",
      [nomePizza, descricao, precoBrotinho, precoMedia, precoGrande, foto]
    );

    res.redirect("/admin");
    return;
  }

}); 


app.get("/delete/:id", async function (req, res) {
  
  const id = parseInt(req.params.id);
  if (!isNaN(id) && id > 0) {
    await db.query("DELETE FROM pizza WHERE pizza_id = ?", [id]);
  }
  res.redirect("/admin");
});

app.get("/editar-pizza/:id", async function (req, res) {
  const id = parseInt(req.params.id);
  const dados = await db.query("SELECT * FROM pizza WHERE pizza_id = ?", [id]);
  console.log(dados[0]);

  if (dados.length === 0) {
    res.redirect("/admin");
    return;
  }
  res.render("editar-pizza", {
    tituloPagina: "Editar Pizza",
    layout: "admin",
    nomePizza: dados[0].nomePizza,
    descricao: dados[0].descricao,
    precoBrotinho: dados[0].precoBrotinho,
    precoMedia: dados[0].precoMedia,
    precoGrande: dados[0].precoGrande,
    foto: dados[0].foto
  });
});

app.post("/editar-pizza/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const nomePizza = req.body.nomePizza.toUpperCase();
  const descricao = req.body.descricao;
  const precoBrotinho = req.body.precoBrotinho;
  const precoMedia = req.body.precoMedia;
  const precoGrande = req.body.precoGrande;
  const foto = req.body.foto;

  const dadosPagina = {
    tituloPagina: "Editar Pizzas",
    mensagem: "",
    nomePizza: nomePizza,
    descricao: descricao,
    precoBrotinho: precoBrotinho,
    precoMedia: precoMedia,
    precoGrande: precoGrande,
    foto: foto
  };


    let sql =
      "UPDATE pizza SET nomePizza = ?, descricao = ?, precoBrotinho = ?, precoMedia = ?, precoGrande = ?, foto = ? WHERE pizza_id = ?";
    let valores = [nomePizza, descricao, precoBrotinho, precoMedia, precoGrande, foto, id];
    // atualiza os dados na base de dados
    await db.query(sql, valores);

  res.redirect("/admin");
});


// Inicialização do servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
