module.exports = {

    jurosCompostos (req, res, next) {

        try {
            const { investimento, aplicacao, tempo, rentabilidade } = req.body
            
            //a capital é o somatório do investimento com a aplicação
            let capital = parseFloat(investimento) + parseFloat(aplicacao)
            
            //cálculos com rntabilidade e tempo
            let v1 = parseFloat(rentabilidade) / 100;
            let v2 = 1 + parseFloat(v1);
            let v3 = parseFloat(v2) ** parseFloat(tempo);
            
            //cálculo do montante final
            let montante = parseFloat(capital) * parseFloat(v3);
            
            //montante formatado para o número não retornar tão extenso
            let montanteFormatado = montante.toFixed(4)

            res.json(montanteFormatado)
        } catch (error) {
            next(error)
        }
        
    }

}
