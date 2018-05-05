const announcements = require('express').Router()
const Announcement = require('../models/Announcement').Announcement;
const bodyParser = require('body-parser')

const announFindMiddleware = require("../middlewares/findAnnouncement");

announcements.use(bodyParser.urlencoded({ extended: true }))
announcements.use(bodyParser.json())

announcements.use('/:id*', announFindMiddleware);
  
announcements.route('/')
  .get((req,res) => {
    console.log("GET announcement");
    Announcement.find({}, function(err, announcementsGot) {
      if(err){res.status(400).json(err)}
      res.json(announcementsGot);//Todas las comvocatorias
    })
  })
  .post((req,res) => {
      console.log("POST announcement: " + req.session.user_id);
      const data = req.body.announ;
      data.idCreator = req.session.user_id;
      const announcement = new Announcement(data);

      announcement.save()
        .then((data) => res.json(data))
        .catch((err) => {
          console.log(err.message);
          res.status(400).json({err: err.message});
        })
  })

announcements.route('/:id')
  .get((req, res) => {
      console.log("GET announcements by id");
      Announcement.find({_id: req.params.id}, function(err, announcementGot) {
        if(err){res.status(404).json(err)}
        else
          res.json(announcementGot);
      })
  })
  .put((req, res) => {
    console.log("PUT announcement");
    if(res.locals.permission)
    {
      const data = req.body
      Announcement.findByIdAndUpdate(
        req.params.id, // id
        {
          $set:
          {
            title: data.title,
            creationDate: data.creationDate,
            endEnrollmentsDate: data.endEnrollmentsDate,
            evaluationDate: data.evaluationDate,
            deadlineDate: data.deadlineDate,
            evaluators: data.evaluators,
            projectsPerEvaluator: data.projectsPerEvaluator,
            content: data.content
          }
        },
        { new: true },
        (err,data) => {
          if (err) res.status(400).json(err)
          res.json(data)
        }
      )
    }
    else
      res.status(403).json({err: "Acceso denegado"});
    // Mongoose Update Docs: http://mongoosejs.com/docs/documents.html
  })
  .delete((req,res) => {
    console.log("DELETE announcement");
    if(res.locals.permission)
    {
      Announcement.findByIdAndRemove(req.params.id, (err,data) => {
      if (err) res.status(400).json(err)
        res.json(data)
      })
    }
    else
      res.status(403).json({err: "Acceso denegado"});
    // Mongoose Remove Docs: http://mongoosejs.com/docs/api.html#findbyidandremove_findByIdAndRemove
  })

announcements.route('/user')
  .get((req, res) => {
    console.log("GET user's announcements");
    Announcement.find({idCreator: req.session.user_id}, function(err, announcementsGot) {
      if(err){res.status(400).json(err)}
      res.json(announcementsGot);//Todas las comvocatorias del usuario
    })
  })

module.exports = announcements;