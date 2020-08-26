const express = require('express')
const routes = require('./routes')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//cors para autorizar outras aplicações usarem o backend
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE")
    app.use(cors())
    next()
})

app.use(routes)

//catch all para pegar todos erros (middleware)
app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({ error: error.message })
})


app.listen(3000)