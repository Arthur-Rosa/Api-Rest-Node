const Sequelize = require('sequelize');
const db = require('./db');

const Usuario = db.define('users',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    senha:{
        type: Sequelize.STRING
    }
});
// Cria a tabela
// Usuario.sync();
// Verifica se precisa de alteração na tabela
/* Usuario.sync({
    alter: true
}); */

module.exports = Usuario;