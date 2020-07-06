//importando o knex para usar
const knex = require('../database')
//biblioteca para encriptar
const bcrypt = require('bcryptjs')

//função para verificar se a cidade que está cadastrando já existe
verificaCidade = async (cidade) => {
    const select = await knex('cidade').where('nome_city', cidade).select('id_city')
    
    if(select.length == 0){
        //verdadeiro para cadastrar
        return true
    }else{
        //caso já exista
        return Object.values(select[0])
    }
}

//função para verificar se a cidade que está cadastrando já existe
verificaCep = async (cep) => {
    const select = await knex('endereco').where('cep_end', cep).select('cep_end')
    
    if(select.length == 0){
        //verdadeiro para cadastrar
        return true
    }else{
        //caso já exista
        return Object.values(select[0])
    }
}

//função para encriptar senha
encryptSenha = async (senha) => {
    const hash = await bcrypt.hash(senha, 10)

    return hash
}

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
            let vcidade = await verificaCidade(cidade) //se true temos que cadastrar

            if(vcidade == true){
                const regist_cidade = await knex('cidade').insert(
                    { 
                        nome_city: cidade,
                        id_uf: estado
                    }
                )
                
                vcidade = await verificaCidade(cidade) //pegar o id da cidade que acabou de registrar
            }

            //registrando o endereço
            let vcep = await verificaCep(cep) //se true temos que cadastrar

            if(vcep == true){
                const regist_endereco = await knex('endereco').insert(
                    { 
                        cep_end: cep,
                        lograd_end: rua, 
                        bairro_end: bairro, 
                        id_city: vcidade[0]
                    }
                )

                vcep = await verificaCep(cep) //pegar o cep que acabou de registrar
            }

            //registrando na tabela pessoa
            hash = await encryptSenha(senha)

            const regist_pessoa = await knex('pessoa').insert(
                { 
                    cpf_pes: cpf, 
                    nome_pes: nome, 
                    date_nasc: datanasc, 
                    sal_pes: sal, 
                    cep_end: vcep[0],
                    comp_pes: complemento,
                    num_pes: numero,
                    cel_pes: celular,
                    tel_com: telefone,
                    email_pes: email,
                    pass_pes: hash
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