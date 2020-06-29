//importando o knex para usar
const knex = require('../database')

module.exports = {
    //listar todos orçamentos
    async index(req, res, next) {
        try{
            const results = await knex('orcamento')

            return res.json(results)
        }catch (error){
            next(error)
        }
    },

    //listar apenas orçamento de um usuário
    async show(req, res, next) {

        try{
            const { id } = req.params

            const result = await knex('orcamento').where('id_pes', id)

            return res.json(result)
        }catch (error) {
            next(error)
        }
            
        
    },

    //cadastrar um orçamento
    async create(req, res, next) {
        try{
            const { 
                date_orc,
                renda_orc,
                gasto_total,
            } = req.body

            const { id } = req.params

            //registrando orçamento
            const regist_orcamento = await knex('orcamento').insert(
                { 
                    date_orc,
                    renda_orc,
                    gasto_total,
                    id_pes: id
                }
            )

            return res.json({ ok: "orçamento cadastrado" })

        }catch (error) {
            next(error)
        }
    }
 }