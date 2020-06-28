const express = require('express')
const routes = express.Router()

const UserController = require('./controllers/UserController')

//listar todos os usuários
routes.get('/users', UserController.index)

//listar apenas um usuário
routes.get('/users/:id', UserController.show)

//cadastrar usuário
routes.post('/users', UserController.create)

module.exports = routes