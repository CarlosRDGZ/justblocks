const api = require('express').Router()
const users = require('./users')
const session = require('./session')
const announcement = require('./announcement')
// const sessionMiddleware = require('../middlewares/session');//Para validar los usuarios

// api.use("/", sessionMiddleware);
api.use('/user', users)
api.use('/session', session)
api.use('/announcement', announcement)

module.exports = api