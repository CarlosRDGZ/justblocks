const partakers = require('express').Router()
const Partaker = require('../models/Partaker').Partaker
const bodyParser = require('body-parser')

partakers.use(bodyParser.urlencoded({ extended: true }))
partakers.use(bodyParser.json())

partakers.route('/')
  .post((req,res) => {
    const partaker = new Partaker(req.body)
    partaker.save()
      .then(data => res.status(200).json(data))
      .catch(err => res.json(err))
  })

partakers.route('/project/:id')
  .get((req,res) => {
    let id = req.params.id
    Partaker.findOne({ idProject: id }, (err,data) => {
      if (err) res.json(err)
      res.status(200).json(data)
    })
  })

  partakers.route('/user/:id')
    .get((req,res) => {
      let id = req.params.id
      Partaker.findOne({ idUser: id }, (err,data) => {
        if (err) res.json(data)
        res.status(200).json(data)
      })
    })
  
  partakers.route('/:id')
    .delete((req,res) => {
      let id = req.params.id
      Partaker.findByIdAndRemove(id, (err,data) => {
        if (err) res.json(err)
        res.status(200).json(data)
      })
    })