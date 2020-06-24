const express = require('express')

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.send("Beggining")
})

app.listen(3000)