const project = require('express').Router()
const bodyParser = require('body-parser');
const Project = require('../models/Project').Project

project.use(bodyParser.json()); //Para peticiones aplication/json
project.use(bodyParser.urlencoded({extended: true}));

project.get('/edit/:id', (req,res) => {
  Project.count({_id: req.params.id})
    .then(count => 
      count === 1 ?
      res.render('app/project/edit', { id: req.params.id }) :
      res.status(403).send('Denegado'))
    .catch(err => res.status(500).send(err))
})

module.exports = project