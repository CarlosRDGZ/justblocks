const partakers = require('express').Router()
const Partaker = require('../models/Partaker').Partaker
const bodyParser = require('body-parser')

partakers.use(bodyParser.urlencoded({ extended: true }))
partakers.use(bodyParser.json())

partakers.use()