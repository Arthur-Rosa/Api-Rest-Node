const express = require("express");
var cors = require('cors');
const db = require('./models/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Usuario = require('./models/Usuario');
const { eAdmin } = require('./middlewares/auth');
const bcrypt = require('bcryptjs');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "X-PINGOTHER, Content-Type, Authorization");
    app.use(cors());
    next();
});

app.get("/users", eAdmin, async (req, res) => {
    await Usuario.findAll({
        attributes: ['id', 'name', 'email', 'senha'],
        order: [['id', 'DESC']]
    })
        .then((users) => {
            return res.json({
                success: 'Sucesso',
                users
            });
        }).catch(() => {
            return res.status(400).json({
                erro: 'Ocorreu um erro',
                mensagem: 'Erro: nenhum usuário encontrado'
            });
        });
});

app.get("/user/:id", eAdmin, async (req, res) => {
    const { id } = req.params;

    /* await Usuario.findAll({
        where: {
            id: id
        }
    }) */
    await Usuario.findByPk(id)
        .then((user) => {
            return res.json({
                erro: false,
                user
            });
        }).catch(() => {
            return res.status(400).json({
                erro: 'Ocorreu um erro',
                mensagem: 'Erro: nenhum usuário encontrado'
            });
        });
});

app.post("/user", async (req, res) => {
    var dados = req.body;

    dados.senha = await bcrypt.hash(dados.senha, 8);

    await Usuario.create(req.body)
        .then(() => {
            return res.json({
                erro: 'Sucesso',
                mensagem: 'Cadastrado com Sucesso',
                dados
            });
        }).catch(() => {
            return res.status(400).json({
                erro: 'Error',
                mensagem: 'Não foi possivel criar o Usuario'
            });
        });
});

app.put("/user", eAdmin, async (req, res) => {
    const { id } = req.body;

    await Usuario.update(req.body, {
        where: {
            id
        }
    }).then((user) => {
        return res.json({
            erro: 'Sucesso',
            mensagem: 'Editado com sucesso\ '
        });
    }).catch(() => {
        return res.status(400).json({
            erro: 'Error',
            mensagem: 'Erro ao editar o usuario'
        });
    });
});

app.put("/user-senha", eAdmin, async (req, res) => {
    const { id, senha } = req.body;

    var senhaCript = await bcrypt.hash(senha, 8);

    await Usuario.update(
        {
            senha: senhaCript
        }, {
        where: {
            id
        }
    }).then((user) => {
        return res.json({
            erro: 'Sucesso',
            mensagem: 'Senha editada com sucesso\ '
        });
    }).catch(() => {
        return res.status(400).json({
            erro: 'Error',
            mensagem: 'Erro ao editar a senha'
        });
    });
});

app.delete("/user/:id", eAdmin, async (req, res) => {
    const { id } = req.params;

    await Usuario.destroy({
        where: {
            id
        }
    }).then(() => {
        return res.json({
            sucesso: "Sucesso",
            mensagem: "Usuario apagado com sucesso !!!"
        });
    }).catch(() => {
        return res.status(400).json({
            erro: "Error",
            mensagem: "Usuario não apagado"
        });
    });
});

app.post("/login", async (req, res) => {
    const usuario = await Usuario.findOne({
        attributes: ['id', 'name', 'email', 'senha'],
        where: {
            email: req.body.email
        }
    });

    if (await usuario === null) {
        return res.status(400).json({
            sucesso: "Erro",
            mensagem: "Usuario ou Senha incorreta"
        });
    }

    if (!(await bcrypt.compare(req.body.senha, usuario.senha))) {
        return res.json({
            sucesso: "Erro",
            mensagem: "Usuario ou Senha incorreta"
        });
    }

    var token = jwt.sign({ id: usuario.id }, process.env.SECRET, {
        // expiresIn: 600 --- 7 dias
        expiresIn: '7d'
    });

    return res.json({
        sucesso: "Conectado",
        mensagem: "Usuario conectado com sucesso !",
        token
    });
});

app.get("/val-token", eAdmin, async (req, res) => {
    await Usuario.findByPk(req.usuarioId, {
        attributes: ['id', 'name', 'email']
    })
    .then((user) => {
        return res.json({
            erro: false,
            mensagem: "Token válido",
            user
        });
    }).catch((e) => {
        return res.json({
            erro: true,
            mensagem: "Error",
            e
        });
    });
});

app.listen(8080, () => {
    console.log("Server Iniciado");
});