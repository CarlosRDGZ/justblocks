const partakers = require('express').Router()
const Partaker = require('../models/Partaker').Partaker
const bodyParser = require('body-parser')

partakers.use(bodyParser.urlencoded({ extended: true }))
partakers.use(bodyParser.json())

partakers.route('/') 
  .post((req,res) => { 
    const partaker = new Partaker(req.body)
    partaker.save()
      .then(data => res.json(data))//Validar que no pertenezca ya, que no sea el dueño de la convocatoria ni evaluador de la misma
      .catch(err => res.status(400).json(err))
  }) 
  .get((req, res) => {
    console.log("GET partakers");
    Partaker.find({})
    .populate('idUser', ['name', '_id', 'email'])
    .exec( function(err, all) {
      if(err){console.log("Partaker find error"); console.log(err.message); res.status(400).json({err: err.message})}
      else
        res.json(all);
    })
  })

partakers.route('/count/:rol')
  .get((req,res) => {
    let rol = req.params.rol
    Partaker.count({ rol: rol }, (err,total) => {
      if (err) res.status(400).json(err)
      res.json(total)
    })
  })

partakers.route('/project/:id')
  .get((req,res) => {
    console.log("GET partakers by idProject");
    let id = req.params.id
    Partaker.find({ idProject: id })
    .populate('idUser', ['name', '_id', 'email'])
    .exec( function(err, all) {
      if(err){console.log("Partaker find error"); console.log(err.message); res.status(400).json({err: err.message})}
      else
        res.json(all);
    })
  })

partakers.route('/project/:id/rol/:rol')
  .get((req,res) => {
    console.log("GET partakers by idProject and rol");
    let id = req.params.id, rol = req.params.rol
    Partaker.find({ idProject: id, rol: rol })
      .populate('idUser', ['name', '_id', 'email'])
      .exec( function(err, all) {
        if(err){console.log("Partaker find error"); console.log(err.message); res.status(400).json({err: err.message})}
        else
          res.json(all);
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
    console.log("DELETE partaker by id");
    let id = req.params.id
    Partaker.findByIdAndRemove(id, (err,data) => {
      if (err) res.status(400).json(err)
      res.json(data)
    })
  })
  .get((req, res) => {
    console.log("GET partaker by id");
    let id = req.params.id;
    Partaker.findById(id)
      .populate('idUser', ['name', '_id', 'email'])
      .exec((err, partk) => {
        if(err) {console.log("GET partakers by id error"); console.log(err.message); res.status(500).json({err: err.message});}
        else
          res.json(partk);
      })
  })
  .put((req, res) => {
    console.log("GET partaker by id");
    let id = req.params.id;
    Partaker.update({ _id: id }, { $set: req.body }, {new: true}, (err, partk) => {
      if(err) {console.log("PUT partaker error"); console.log(err.message); res.status(500).json({err: err.message});}
      else
        res.json(partk);
    })
  })

module.exports = partakers