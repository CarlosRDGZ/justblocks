const api = require('express').Router()
const users = require('./users')
const project = require('./project')
const announcement = require('./announcement')
const partaker = require('./partaker')
// const sessionMiddleware = require('../middlewares/session');//Para validar los usuarios

// api.use("/", sessionMiddleware);
api.use('/user', users)
api.use('/announcement', announcement)
api.use('/project', project)
api.use('/partaker', partaker)

module.exports = api