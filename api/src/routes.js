const express = require('express')
const routes = express.Router()

const UserController = require('./controllers/UserController')
const OrcamentoController = require('./controllers/OrcamentoController')
const SimuladoresController = require('./controllers/SimuladoresController')
const BalancoAnualController = require('./controllers/BalancoAnualController')

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


//simular juros compostos
routes.post('/juroscompostos', SimuladoresController.jurosCompostos)

//simular independência financeira
routes.post('/independenciafinanceira', SimuladoresController.independenciaFinanceira)



//importando o middleware da auth
const authMiddleware = require('./middlewares/auth')

routes.use(authMiddleware)

//listar todos os orçamentos
routes.get('/orc', OrcamentoController.index)

//listar apenas um Orçamento
routes.get('/orc/:id', OrcamentoController.show)

//cadastrar orçamento
routes.post('/orc/:id', OrcamentoController.create)

//consultar balanço anual do usuário
routes.get('/balancoanual/:id', BalancoAnualController.index)


module.exports = routes