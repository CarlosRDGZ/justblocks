const api = require('express').Router()
const users = require('./users')
const announs = require('./announcement')

api.use('/user', users)
api.use('/announcement', announs)

module.exports = api