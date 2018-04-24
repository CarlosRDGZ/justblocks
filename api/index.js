const api = require('express').Router()
const users = require('./users')
const project = require('./project')
const announcement = require('./announcement')
// const sessionMiddleware = require('../middlewares/session');//Para validar los usuarios

// api.use("/", sessionMiddleware);
api.use('/user', users)
api.use('/announcement', announcement)
api.use('/project', project)

module.exports = api