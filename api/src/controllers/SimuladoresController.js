const puppeteer = require('puppeteer')

rentabilidade = async () => {
    const tesourourl = 'https://www.tesourodireto.com.br/titulos/calculadora.htm'
    const ibgeurl = 'https://www.ibge.gov.br/explica/inflacao.php'
    const poupancaurl = 'https://artigos.toroinvestimentos.com.br/poupanca-rendimento-hoje'

    let browser = await puppeteer.launch()
    
    let page = await browser.newPage()
    let page2 = await browser.newPage()
    let page3 = await browser.newPage()
    
    await page.goto(tesourourl, {waitUntil: 'networkidle2'})

    let tesouro = await page.evaluate(() => {
        let rentprefixado2026 = document.querySelectorAll('td[class="td-calc-table__invest__item"]')[5].innerHTML
        let rentipca20352045 = document.querySelectorAll('td[class="td-calc-table__invest__item"]')[21].innerHTML

        return { rentprefixado2026, rentipca20352045 }
    })

    await page2.goto(ibgeurl, {waitUntil: 'networkidle2'})

    let ibge = await page2.evaluate(() => {
        let ipca = document.querySelector('p[class="variavel-dado"]').innerHTML

        return ipca
    })

    await page3.goto(poupancaurl, {waitUntil: 'networkidle2'})

    let poupanca = await page3.evaluate(() => {
        let rentpoupanca =  document.querySelector('strong[class="q POUPANCA"]').innerHTML

        return rentpoupanca
    })

    await browser.close()

    return { tesouro, ibge, poupanca }
}


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
            let montanteFormatado = montante.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

            res.json(montanteFormatado)
        } catch (error) {
            next(error)
        }
        
    },

    independenciaFinanceira(req, res, next) {
        try {
            
            const { investir, receber, inflacao } = req.body

            //calculo da independencia financeira
            let n = (parseFloat(investir) + parseFloat(receber) * 12) / (parseFloat(inflacao))

            //formatando pra padrão br
            const formatado = n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

            res.json(formatado)

        } catch (error) {
            next(error)
        }
    },

    async comparadores(req, res, next){
        try {
            
            const { investimento, tempo } = req.body
            
            //pegamos as rentabilidades vindo da função
            let rentabilidades = await rentabilidade()
            
            //trocamos a virgula por ponto para transformar em float depois
            let rentprefixado2026 = rentabilidades.tesouro.rentprefixado2026.replace(",", ".")
            
            //pegando a rentabilidade ipca2035 e 2045 precisamos dar split para pegar só o valor
            let rentipca20352045 = rentabilidades.tesouro.rentipca20352045
            let separa = rentipca20352045.split(' ')
            //trocamos a virgula por ponto para transformar em float depois
            rentipca20352045 = separa[2].replace(",", ".")

            //pegamos o IPCA
            let ipca = rentabilidades.ibge
            //vamos tirar a porcentagem da string e trocar a virgula por ponto
            ipca = ipca.replace("%", "")
            ipca = ipca.replace(",", ".")

            //pegamos a rentabilidade da poupança
            let rentpoupanca = rentabilidades.poupanca
            rentpoupanca = ipca.replace("%", "")
            rentpoupanca = ipca.replace(",", ".")

            //rentabilidades formatadas para conta
            const prefixado_2026 = parseFloat(rentprefixado2026)
            const ipca_2045 = parseFloat(rentipca20352045) + parseFloat(ipca)
            const ipca_2035 = parseFloat(rentipca20352045) + parseFloat(ipca)
            const poupanca = parseFloat(rentpoupanca)

            //Calculos de poupança

            var p1 = parseFloat(tempo) * parseFloat(poupanca);
            var p2 = parseFloat(p1) / 100;
            var p3 = parseFloat(p2) * parseFloat(investimento);

            var p4 = parseFloat(p3) + parseFloat(investimento);

            const fp2 = p4.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });


            //Calculos de Tesouro IPCA 2045

            var t1 = parseFloat(tempo) * parseFloat(ipca_2045);
            var t2 = parseFloat(t1) / 100;
            var t3 = parseFloat(t2) * parseFloat(investimento);
            var t4 = parseFloat(t3) + parseFloat(investimento); 

            const ft = t4.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            //Calculos de Tesouro IPCA 2035

            var i1 = parseFloat(tempo) * parseFloat(ipca_2035);
            var i2 = parseFloat(i1) / 100;
            var i3 = parseFloat(i2) * parseFloat(investimento);
            var i4 = parseFloat(i3) + parseFloat(investimento); 

            const fi = i4.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });


            //Calculos de Tesouro PREFIXADO

            var tp1 = parseFloat(tempo) * parseFloat(prefixado_2026);
            var tp2 = parseFloat(tp1) / 100;
            var tp3 = parseFloat(tp2) * parseFloat(investimento);
            var tp4 = parseFloat(tp3) + parseFloat(investimento); 

            const ftp = tp4.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            res.json({
                "Valor tesouro prefixado 2026": ftp,
                "Valor tesouro ipca 2045": ft,
                "Valor tesouro ipca 2035": fi,
                "Valor poupança": fp2
            });  

        } catch (error) {
            next(error)
        }
    }

}
