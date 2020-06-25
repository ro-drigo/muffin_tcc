const express = require('express')
//importando o knex para usar
const knex = require('./database')

const app = express()

app.use(express.json())

//testando a conexão
app.get('/users', (req, res) => {
    knex('pessoa').then((results) => res.json(results))
})

app.listen(3000)