const announcements = require('express').Router()
const Announcement = require('../models/Announcement').Announcement;
const bodyParser = require('body-parser')

const sessionMiddleware = require('../middlewares/session');//Para validar los usuarios
const announFindMiddleware = require("../middlewares/findAnnouncement");

announcements.use(bodyParser.urlencoded({ extended: true }))
announcements.use(bodyParser.json())

// announcements.use('/view', announFindMiddleware);

//********************* NO CRUD, no es necesario logguearte para acceder a esto
announcements.get("/view/:id", function(req, res) {
  console.log("GET announ");

  Announcement.find({_id: req.params.id}, function(err, announcementGot) {
      if(err)
        res.sendStatus(500);
      else
      {
        console.log(announcementGot);
        res.status(200).json(announcementGot);
      }
    })
})
  
announcements.get("/all", function(req, res) {
    Announcement.find({}, function(err, announcementsGot) {
        if (err)
        res.sendStatus(500)
        else
          res.status(200).json(announcementsGot)
      })
})
///******************************


announcements.use('/', sessionMiddleware);
announcements.use('/:id*', sessionMiddleware);

announcements.use('/:id*', announFindMiddleware);
  
announcements.route('/')
  .get((req,res) => { //Le regresa todas sus convocatorias (las que el dio de alta)
    console.log("GET announcement");
    Announcement.find({idCreator: userSession._id}, function(err, announcementsGot) {
      if(err){res.status(400).json(err)}
      res.json(announcementsGot);//Todas las comvocatorias del usuario
    })
  })
  .post((req,res) => {
      console.log("POST announcement");
      const data = req.body;
      data.idCreator = req.session.user_id;
      const announcement = new Announcement(data);

      announcement.save()
        .then((data) => res.json(data))
        .catch((err) => res.status(400).json({err: err.message}))
  })

announcements.route('/:id')
  .put((req, res) => {
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
    // Mongoose Update Docs: http://mongoosejs.com/docs/documents.html
  })
  .delete((req,res) => {
    console.log("DELETE announcement");
    Announcement.findByIdAndRemove(req.params.id, (err,data) => {

      if (err) res.status(400).json(err)
        res.json(data)
    })
    // Mongoose Remove Docs: http://mongoosejs.com/docs/api.html#findbyidandremove_findByIdAndRemove
  })

module.exports = announcements;
