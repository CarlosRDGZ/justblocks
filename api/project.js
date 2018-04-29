const projects = require('express').Router()
const Project = require('../models/Project').Project
const bodyParser = require('body-parser')

projects.use(bodyParser.urlencoded({ extended: true }))
projects.use(bodyParser.json())

projects.route('/')
  .get((req,res) => {
    Project.find({}, (err,projects) => {
      if (err)
        res.status(400).json(err)
      res.json(projects)
    })
  })
  .post((req,res) => {
    console.log(req.body)
    const project = new Project(req.body)
    project.save()
      .then(data => res.json(data))
      .catch(err => res.status(400).json(err))
  })

projects.route('/:id')
  .put((req,res) => {
    Project.findByIdAndUpdate(
      req.params.id,
      {
        $set:
        {
          description: body.description,
          score: body.score
        }
      },
      { new: true },
      (err,data) => {
        if (err) res.status(400).json(err)
        res.json(data)
      }
    )
  })
  .delete((req,res) => {
    Project.findByIdAndRemove(req.params.id, (err,data) => {
      if (err) res.status(400).json(err)
      res.json(data)
    })
  })

projects.route('/announcement/:id')
  .get((req,res) => {
    Project.find({ idAnnouncement: req.params.id }, (err,projects) => {
      if (err)
        res.status(400).json(err)
      res.json(projects)
    })
  })

projects.route('/user/:id')
  .get((req,res) => {
    Project.find({ idCreator: req.params.id }, (err,projects) => {
      if (err)
        res.status(400).json(err)
      res.json(projects)
    })
  })

module.exports = projects