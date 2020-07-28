//importando o knex para usar
const knex = require('../database')


module.exports = {
    //listar balanço anual
    async index(req, res, next) {
        try{
            const { id } = req.params

            //comando para calcular o total da reserva mensal
            const meses = await knex('orcamento').where('id_pes', id).select('date_orc', 'reserva_mensal')

            let conta = meses.length
            let soma = 0
            let obj = []

            if(conta == 0)
                return res.json({ error: "usuário ainda não possui orçamento" })


            while(conta > 0){
                for(i=0; i<conta; i++){
                    soma += parseFloat(meses[i].reserva_mensal)
                }

                //pegamos o mês que estamos usando como referência
                mes = meses[conta-1].date_orc

                //salvar tudo em um objeto para usar depois
                mes = mes.toString()

                let separa = mes.split(" ")

                if(separa[1] == "Jan"){
                    mes = "Janeiro/"+separa[3]
                }else if(separa[1] == "Feb"){
                    mes = "Fevereiro/"+separa[3]
                }else if(separa[1] == "Mar"){
                    mes = "Março/"+separa[3]
                }else if(separa[1] == "Apr"){
                    mes = "Abril/"+separa[3]
                }else if(separa[1] == "May"){
                    mes = "Maio/"+separa[3]
                }else if(separa[1] == "Jun"){
                    mes = "Junho/"+separa[3]
                }else if(separa[1] == "Jul"){
                    mes = "Julho/"+separa[3]
                }else if(separa[1] == "Aug"){
                    mes = "Agosto/"+separa[3]
                }else if(separa[1] == "Sep"){
                    mes = "Setembro/"+separa[3]
                }else if(separa[1] == "Oct"){
                    mes = "Outubro/"+separa[3]
                }else if(separa[1] == "Nov"){
                    mes = "Novembro/"+separa[3]
                }else if(separa[1] == "Dec"){
                    mes = "Dezembro/"+separa[3]
                }

                obj.push({"mes": mes, "reserva mensal": soma}) 
                     
                //resetar o cálculo da soma
                soma = 0
                conta--
            }

            res.json({reserva_mensal: obj})

        }catch (error) {
            next(error)
        }
    }
 }