const express = require("express");
const db = require('./models/db');
const jwt = require('jsonwebtoken');
const Usuario = require('./models/Usuario');
const { promisify } = require('util');
const bcrypt = require('bcryptjs');

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    return res.json({
        erro: false
    });
});

app.get("/users", validarToken, async (req, res) => {
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

app.get("/user/:id", validarToken, async (req, res) => {
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

app.put("/user", validarToken, async (req, res) => {
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

app.put("/user-senha", validarToken, async (req, res) => {
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

app.delete("/user/:id", validarToken, async (req, res) => {
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
            mensagem: "Usuario não apagado com sucesso"
        });
    });
});

app.post("/login", async (req, res) => {
    const usuario = await Usuario.findOne({
        attributes: ['id', 'name', 'email', 'senha'],
        where:{
            email: req.body.email
        }
    });

    if(await usuario === null){
        return res.status(400).json({
            sucesso: "Erro",
            mensagem: "Usuario não encontrado"
        });
    }

    if(!(await bcrypt.compare(req.body.senha, usuario.senha))){
        return res.json({
            sucesso: "Erro",
            mensagem: "Senha inválida"
        });
    }

    var token = jwt.sign({ id: usuario.id }, 'a6f5dsa4f5d4as4w7ha',{
        // expiresIn: 600
        // 7 dias
        expiresIn: '7d'
    });

    return res.json({
        sucesso: "Conectado",
        mensagem: "Usuario conectado com sucesso !",
        token
    });
});

async function validarToken(req, res, next){
    /* return res.json({
        mensagem: 'validou token'
    }); */
    const authHeader = req.headers.authorization;
    const [bearer, token] = authHeader.split(' ');

    if(!token){
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Necessário fazer login para entrar na página !"
        });
    };

    try{
        const decoded = await promisify(jwt.verify)(token, 'a6f5dsa4f5d4as4w7ha');
        req.usuarioId = decoded.id;

        return next();  
    } catch (err) {
        return res.status(401).json({
            erro: true,
            mensagem: "Erro: Necessário fazer login para entrar na página !"
        });
    }
}

app.listen(8080, () => {
    console.log("Server Iniciado");
});