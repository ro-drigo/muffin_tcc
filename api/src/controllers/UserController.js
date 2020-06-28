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

        const result = await knex('pessoa').where('id_pes', id)

        return res.json(result)
            
        
    },

    //cadastrar um usuário
    async create(req, res) {
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
              id_cep: cep,
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
                 sal_pes: sal, 
                 id_cep: cep,
                 comp_pes: complemento,
                 num_pes: numero,
                 cel_pes: celular,
                 tel_com: telefone,
                 email_pes: email,
                 pass_pes: senha
             }
        )

         return res.json({ ok: "usuário cadastrado" })
    }
 }

