const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: 3307
});

sequelize.authenticate()
.then(function(){
    console.log("Conectado com sucesso !");
}).catch(function(){
    console.log("Error na conexão");
});

module.exports = sequelize;