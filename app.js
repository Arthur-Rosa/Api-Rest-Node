const express = require("express");
const db = require('./models/db');
const Usuario = require('./models/Usuario');

const bcrypt = require('bcryptjs');

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    return res.json({
        erro: false,
        nome: "nome Usuario",
        email: "emailDoUsuario"
    });
});

app.get("/users", async (req, res) => {
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

app.get("/user/:id", async (req, res) => {
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

app.put("/user", async (req, res) => {
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

app.put("/user-senha", async (req, res) => {
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

app.delete("/user/:id", async (req, res) => {
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
        attributes:{
            column: senha
        },
        where:{
            email: req.body.email
        }
    });

    if(usuario === null){
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

    
});

app.listen(8080, () => {
    console.log("Server Iniciado");
});