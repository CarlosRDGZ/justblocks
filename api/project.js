const projects = require('express').Router()
const Project = require('../models/Project').Project
const bodyParser = require('body-parser')

projects.use(bodyParser.urlencoded({ extended: true }))
projects.use(bodyParser.json())

projects.route('/:idAnnouncement')
  .get((req,res) => {
    Project.find(
      {idAnnouncement: req.params.idAnnouncement},
      (err,projects) => {
        if (err)
          res.sendStatus(500)
        else
          res.status(200).json(users)
    })
  })
  .post((req,res) => {
    const object = req.body
    object.idAnnouncement = req.idAnnouncement
    const project = new Project(object)
    project.save()
      .then(data => res.status(200).json(data))
      .catch(err => res.json(err))
  })