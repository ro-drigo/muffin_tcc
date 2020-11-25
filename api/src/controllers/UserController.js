//importando o knex para usar
const knex = require('../database')
//biblioteca para encriptar
const bcrypt = require('bcryptjs')
//importando o jwt
const jwt = require('jsonwebtoken')
//importar o segredo do token
const authConfig = require('../config/auth.json')

//função para verificar se o email já existe
verificaEmail = async (email) => {

        const select = await knex('pessoa').where('email_pes', email).select('email_pes')

        if(select[0] == undefined){
            //se o email não existir no banco, retorna false
            return false
        }else if(select[0].email_pes == email){
            //se existir, retorna true
            return true
        }
        
}

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

//função para gerar token
generateToken = (params = {}) => {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    })
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

            const resultPessoa = await knex('pessoa').where('id_pes', id)
            const resultEndereco = await knex('endereco').where('cep_end', resultPessoa[0].cep_end)
            const resultCidade = await knex('cidade').where('id_city', resultEndereco[0].id_city)


            //não mostrar a senha
            resultPessoa[0].pass_pes = undefined

            return res.json({resultPessoa, resultEndereco, resultCidade})
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
                email,
                cep,
                estado,
                bairro,
                senha

            } = req.body

            //verificando o email
            let vemail = await verificaEmail(email)

            if(vemail == true){
                return res.status(202).send("Email já existe")
            }
                

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
                    cep_end: vcep[0],
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
                cpf

            } = req.body

            const { id } = req.params

            //editar os dados de cidade

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

            //editar os dados de endereço
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

            //editar dados da pessoa
            await knex('pessoa').update
                ({ 
                    nome_pes: nome,
                    cpf_pes: cpf,
                    date_nasc: datanasc,
                    email_pes: email,
                    cel_pes: celular,
                    tel_com: telefone,
                    comp_pes: complemento,
                    num_pes: numero,
                    cep_end: vcep[0]
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
    },
    
    //autenticar um usuário
    async authenticate(req, res) {
        const { email, senha } = req.body

        //verificar se o email está cadastrado
        const user = await knex('pessoa').where('email_pes', email).select('email_pes', 'pass_pes', 'id_pes')

        if(user.length == 0)
            return res.status(202).send("usuário não existe")
        
        //verificando se a senha bate
        if(!await bcrypt.compare(senha, user[0].pass_pes))
            return res.status(202).send("senha inválida")

        //tirando para não exibir a senha
        user[0].pass_pes = undefined

        res.send({ 
            //user, 
            token: generateToken({ id: user[0].id_pes }),
            id: user[0].id_pes,
            status: 200
        })
    }
}