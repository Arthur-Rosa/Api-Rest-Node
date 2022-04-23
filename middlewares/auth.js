const jwt = require('jsonwebtoken');
const { promisify } = require('util');
require('dotenv').config();

module.exports = {
    eAdmin: async function (req, res, next){
        
        const authHeader = req.headers.authorization;

        if(!authHeader){
            return res.json({
                erro: true,
                mensagem: "Erro: Necessário fazer login para entrar na página !"
            });
        };

        const [bearer, token] = authHeader.split(' ');
    
        if(!token){
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Necessário fazer login para entrar na página !"
            });
        };
    
        try{
            const decoded = await promisify(jwt.verify)(token, process.env.SECRET);
            req.usuarioId = decoded.id;
    
            return next();  
        } catch (err) {
            return res.status(401).json({
                erro: true,
                mensagem: "Erro: Necessário fazer login para entrar na página !"
            });
        }
    }    
}