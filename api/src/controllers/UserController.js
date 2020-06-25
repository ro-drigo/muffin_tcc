//importando o knex para usar
const knex = require('../database')

module.exports = {
    async index(req, res) {
        const results = await knex('pessoa')

        return res.json(results)
    }
}