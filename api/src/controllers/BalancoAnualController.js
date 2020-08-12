//importando o knex para usar
const knex = require('../database')

reservaBalanco = async (id) => {
    //comando para calcular o total da reserva mensal
    const meses = await knex('orcamento').where('id_pes', id).select('date_orc', 'reserva_mensal')

    let conta = meses.length
    let soma = 0
    let obj = []

    if(conta == 0)
        return 0


    while(conta > 0){
        for(i=0; i<conta; i++){
            soma += parseFloat(meses[i].reserva_mensal)
        }

        //pegamos o mês que estamos usando como referência
        mes = meses[conta-1].date_orc

        //salvar tudo em um objeto para usar depois
        mes = mes.toString()

        let separa = mes.split(" ")

        //switch para nomear o mês e ano de acordo com a data
        switch(separa[1]){
            case "Jan":
                mes = "Janeiro/"+separa[3]
                break;
            case "Feb":
                mes = "Fevereiro/"+separa[3]
                break;
            case "Mar":
                mes = "Março/"+separa[3]
                break;
            case "Apr":
                mes = "Abril/"+separa[3]
                break;
            case "May":
                mes = "Maio/"+separa[3]
                break;
            case "Jun":
                mes = "Junho/"+separa[3]
                break;
            case "Jul":
                mes = "Julho/"+separa[3]                    
                break;
            case "Aug":
                mes = "Agosto/"+separa[3]
                break;
            case "Sep":
                mes = "Setembro/"+separa[3]
                break;
            case "Oct":
                mes = "Outubro/"+separa[3]                    
                break;
            case "Nov":
                mes = "Novembro/"+separa[3]
                break;
            case "Dec":
                mes = "Dezembro/"+separa[3]
                break;
        }

        obj.push({"mes": mes, "reserva mensal": soma}) 
             
        //resetar o cálculo da soma
        soma = 0
        conta--

    }

    return obj
    
}

economizouBalanco = async (id) => {
    //comando para calcular o total da reserva mensal
    const meses = await knex('orcamento').where('id_pes', id).select('date_orc', 'gasto_total')

    let conta = meses.length
    let obj = []

    if(conta == 0)
        return 0

    while(conta > 1){
        for(i=conta-1; i<conta; i++){

            let economizou = parseFloat(meses[i-1].gasto_total) - parseFloat(meses[i].gasto_total) 

            //pegamos o mês que estamos usando como referência
            let mes = meses[conta-1].date_orc

            //salvar tudo em um objeto para usar depois
            mes = mes.toString()

            let separa = mes.split(" ")

            //switch para nomear o mês e ano de acordo com a data
            switch(separa[1]){
                case "Jan":
                    mes = "Janeiro/"+separa[3]
                    break;
                case "Feb":
                    mes = "Fevereiro/"+separa[3]
                    break;
                case "Mar":
                    mes = "Março/"+separa[3]
                    break;
                case "Apr":
                    mes = "Abril/"+separa[3]
                    break;
                case "May":
                    mes = "Maio/"+separa[3]
                    break;
                case "Jun":
                    mes = "Junho/"+separa[3]
                    break;
                case "Jul":
                    mes = "Julho/"+separa[3]                    
                    break;
                case "Aug":
                    mes = "Agosto/"+separa[3]
                    break;
                case "Sep":
                    mes = "Setembro/"+separa[3]
                    break;
                case "Oct":
                    mes = "Outubro/"+separa[3]                    
                    break;
                case "Nov":
                    mes = "Novembro/"+separa[3]
                    break;
                case "Dec":
                    mes = "Dezembro/"+separa[3]
                    break;
            }

            //colocando os valores dentro do array de objetos
            obj.push({ "economizou": economizou, "mes":  mes})
            
        }
        //diminuímos 1 na conta para fazer o cáculo com o anterior
        conta--
    }

    //esse push é para inserir o quanto o usuário economizou no primeiro orçamento.
    //Como é o primeiro, ele não economizou, pois não tem orçamento antes para calculo.
    obj.push({ "economizou": "---", "mes":  mes})

    return obj
}

guardouBalanco = async (id) => {
    const meses = await knex('orcamento').where('id_pes', id).select('date_orc', 'gasto_total', 'renda_orc')

    //conta quantos meses tem
    let conta = meses.length

    //array onde estarão os objetos para retorno
    let obj = []

    if(conta == 0)
        return 0
    
    while(conta > 0){

        let guardou = meses[conta-1].renda_orc

        //pegamos o mês que estamos usando como referência
        let mes = meses[conta-1].date_orc

        //salvar tudo em um objeto para usar depois
        mes = mes.toString()

        let separa = mes.split(" ")

        //switch para nomear o mês e ano de acordo com a data
        switch(separa[1]){
            case "Jan":
                mes = "Janeiro/"+separa[3]
                break;
            case "Feb":
                mes = "Fevereiro/"+separa[3]
                break;
            case "Mar":
                mes = "Março/"+separa[3]
                break;
            case "Apr":
                mes = "Abril/"+separa[3]
                break;
            case "May":
                mes = "Maio/"+separa[3]
                break;
            case "Jun":
                mes = "Junho/"+separa[3]
                break;
            case "Jul":
                mes = "Julho/"+separa[3]                    
                break;
            case "Aug":
                mes = "Agosto/"+separa[3]
                break;
            case "Sep":
                mes = "Setembro/"+separa[3]
                break;
            case "Oct":
                mes = "Outubro/"+separa[3]                    
                break;
            case "Nov":
                mes = "Novembro/"+separa[3]
                break;
            case "Dec":
                mes = "Dezembro/"+separa[3]
                break;
        }

        obj.push({ "guardou": guardou, "mes":  mes})
            
        conta--
    }

    console.log(obj)
}

module.exports = {
    //listar balanço anual
    async index(req, res, next) {
        try{
            const { id } = req.params

            let reservaMensalBalanco = await reservaBalanco(id)
            let economizouBalancoAnual = await economizouBalanco(id)
            let guardouBalancoAnual = await guardouBalanco(id);
            
            //validando caso o usuario n tenha cadastro de orçamento
            if(reservaMensalBalanco == 0 || economizouBalancoAnual == 0 || guardouBalancoAnual == 0)
                res.status(400).json({ error: "usuário não possui orçamento cadastrado" })


            res.json({
                reserva_mensal_balanco: reservaMensalBalanco,
                economizou_balanco: economizouBalancoAnual
            })

        }catch (error) {
            next(error)
        }
    }
 }