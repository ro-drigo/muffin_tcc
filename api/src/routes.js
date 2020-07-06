const express = require('express')
const routes = express.Router()

const UserController = require('./controllers/UserController')
const OrcamentoController = require('./controllers/OrcamentoController')

//listar todos os usuários
routes.get('/users', UserController.index)

//listar apenas um usuário
routes.get('/users/:id', UserController.show)

//cadastrar usuário
routes.post('/users', UserController.create)

//editar usuário
routes.put('/users/:id', UserController.update)

//deletar usuário
routes.delete('/users/:id', UserController.delete)

//logar usuário
routes.post('/authenticate', UserController.authenticate)


//listar todos os orçamentos
routes.get('/orc', OrcamentoController.index)

//listar apenas um usuário
routes.get('/orc/:id', OrcamentoController.show)

//cadastrar usuário
routes.post('/orc/:id', OrcamentoController.create)


module.exports = routes