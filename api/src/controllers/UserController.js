//importando o knex para usar
const knex = require('../database')

module.exports = {
    //listar todos usuários
    async index(req, res) {
        const results = await knex('pessoa')

        return res.json(results)
    },

    //listar apenas um usuário
    async show(req, res) {
        const { id } = req.params

        try{
            const result = await knex('pessoa').where('id_pes', id)

            return res.json(result)
        } catch(err) {
            console.error(err);
          }
            
        
    }
}

