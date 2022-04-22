const Sequelize = require('sequelize');

const sequelize = new Sequelize('celke', 'root', 'root', {
    host: 'localhost',
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