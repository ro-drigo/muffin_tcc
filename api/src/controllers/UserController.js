//importando o knex para usar
const knex = require('../database')
const { update } = require('../database')

module.exports = {
    //listar todos usuários
    async index(req, res, next) {
        try{
            const results = await knex('pessoa')

            return res.json(results)
        }catch (error){
            next(error)
        }
    },

    //listar apenas um usuário
    async show(req, res, next) {

        try{
            const { id } = req.params

            const result = await knex('pessoa').where('id_pes', id)

            return res.json(result)
        }catch (error) {
            next(error)
        }
            
        
    },

    //cadastrar um usuário
    async create(req, res, next) {
        try{
            const { 
                nome,
                cpf,
                cidade,
                rua,
                complemento,
                celular,
                email,
                datanasc,
                cep,
                estado,
                numero,
                bairro,
                telefone,
                sal,
                senha

            } = req.body

            //registrando a cidade
            const regist_cidade = await knex('cidade').insert(
                { 
                    nome_city: cidade,
                    id_uf: estado
                }
            )
            

            //registrando o endereço
            const regist_endereco = await knex('endereco').insert(
                { 
                    cep_end: cep,
                    lograd_end: rua, 
                    bairro_end: bairro, 
                    id_city: knex('cidade').max('id_city')
                }
            )

            //registrando na tabela pessoa
            const regist_pessoa = await knex('pessoa').insert(
                { 
                    cpf_pes: cpf, 
                    nome_pes: nome, 
                    date_nasc: datanasc, 
                    id_end: knex('endereco').max('id_end'),
                    sal_pes: sal, 
                    comp_pes: complemento,
                    num_pes: numero,
                    cel_pes: celular,
                    tel_com: telefone,
                    email_pes: email,
                    pass_pes: senha
                }
            )

            return res.json({ ok: "usuário cadastrado" })

        }catch (error) {
            next(error)
        }
    },

    //editar um usuário
    async update(req, res, next) {
        try {
            const { 
                nome,
                cpf,
                celular,
                email,
                datanasc,
                telefone,
                sal,
                senha

            } = req.body

            const { id } = req.params

            await knex('pessoa').update
                ({ 
                    nome_pes: nome,
                    cpf_pes: cpf,
                    date_nasc: datanasc,
                    sal_pes: sal,
                    cel_pes: celular,
                    tel_com: telefone,
                    email_pes: email,
                    pass_pes: senha
                }).where('id_pes', id)

            return res.json({ ok: "Usuário editado" })

        } catch (error) {
            next(error)
        }
    },

    //deletar um usuário
    async delete(req, res, next) {
        try {
            const { id } = req.params

            await knex('pessoa').where({ id_pes: id }).del()

            return res.json({ ok: "Usuário deletado" })
        } catch (error) {
            next(error)
        }
    }
    
 }