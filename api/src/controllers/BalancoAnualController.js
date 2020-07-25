//importando o knex para usar
const knex = require('../database')


module.exports = {
    //listar balanço anual
    async index(req, res, next) {
        try{
            const { id } = req.params

            //comando para calcular o total da reserva mensal
            const reserva = await knex('orcamento').where('id_pes', id).sum('reserva_mensal')
            
            res.json({reserva: reserva[0].sum})

        }catch (error) {
            next(error)
        }
    }
 }