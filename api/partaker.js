const partakers = require('express').Router()
const Partaker = require('../models/Partaker').Partaker
const bodyParser = require('body-parser')

partakers.use(bodyParser.urlencoded({ extended: true }))
partakers.use(bodyParser.json())

partakers.route('/')
  .post((req,res) => {
    const partaker = new Partaker(req.body)
    partaker.save()
      .then(data => res.json(data))
      .catch(err => res.status(400).json(err))
  })

partakers.route('/project/:id')
  .get((req,res) => {
    let id = req.params.id
    Partaker.find({ idProject: id }, (err,data) => {
      if (err) res.status(400).json(err)
      res.json(data)
    })
  })

partakers.route('/project/:id/rol/:rol')
  .get((req,res) => {
    let id = req.params.id, rol = req.params.rol
    Partaker.find({ idProject: id, rol: rol }, (err,data) => {
      if (err) res.json(data)
      res.json(data)
    })
  })

partakers.route('/user/:id')
  .get((req,res) => {
    let id = req.params.id
    Partaker.findOne({ idUser: id }, (err,data) => {
      if (err) res.status(400).json(data)
      res.json(data)
    })
  })

partakers.route('/:id')
  .delete((req,res) => {
    let id = req.params.id
    Partaker.findByIdAndRemove(id, (err,data) => {
      if (err) res.status(400).json(err)
      res.json(data)
    })
  })

module.exports = partakers