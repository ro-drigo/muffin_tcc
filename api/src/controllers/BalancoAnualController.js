//importando o knex para usar
const knex = require('../database')


module.exports = {
    //listar balanço anual
    async index(req, res, next) {
        try{
            const { id } = req.params
            res.send("Usuario " + id)

        }catch (error) {
            next(error)
        }
    }
 }