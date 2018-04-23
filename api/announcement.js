const announcements = require('express').Router()
const Announcement = require('../models/Announcement').Announcement;
const bodyParser = require('body-parser')
const sessionMiddleware = require('../middlewares/session');//Para validar los usuarios
const announcementFindMiddleware = require("../middlewares/findAnnouncement");

announcements.use(bodyParser.urlencoded({ extended: true }))
announcements.use(bodyParser.json())

announcements.use('/', sessionMiddleware);
announcements.use('/:id*', sessionMiddleware);

announcements.route('/')
  .get((req,res) => { //Le regresa todas sus convocatorias (las que el dio de alta)
    console.log("GET announcement");
    Announcement.find({idCreator: res.locals.user._id}, function(err, announcementsGot) {
      if(err){res.redirect("/app"); return;}
      res.json(announcementsGot);//Todas las comvocatorias del usuario
    })
  })
  .post((req,res) => {
      console.log("POST announcement");
      console.log(req.session.user_id);
      var body = req.body;
      var announcement = new Announcement({
        idCreator: /*"5ad745e966e45e2f9c0df8ec"*/req.session.user_id,
        creationDate: body.creationDate,
        evaluationDate: body.evaluationDate,
        deadlineDate: body.deadlineDate,
        evaluatorsAmount: body.evaluatorsAmount,
        projectsByEvaluator: body.projectsByEvaluator,
        content: body.content
      });

      announcement.save().then(function(announcementsaved) {
        //Lo logue si sí se pudo guardar el usuario
        res.json(announcementsaved);
      }).catch(function(err) {
        console.log(err.message);
          res.json({err: err.message/*"Hubo un problema al guardar el usuario"*/});
      })
  })

announcements.route('/:id')
  .put(function(req, res) {
    var announcement = new Announcement({
        _id: req.params.id,
        idCreator: /*"5ad745e966e45e2f9c0df8ec"*/req.locals.user._id,
        creationDate: body.creationDate,
        evaluationDate: body.evaluationDate,
        deadlineDate: body.deadlineDate,
        evaluatorsAmount: body.evaluatorsAmount,
        projectsByEvaluator: body.projectsByEvaluator,
        content: body.content
      });

    announcement.save().then(function(announcementsaved) {
        //Lo logue si sí se pudo guardar el usuario
        res.json(announcementsaved);
      }).catch(function(err) {
        console.log(err.message);
          res.json({err: err.message/*"Hubo un problema al guardar el usuario"*/});
      })
  })
  .delete(function(req, res) {
    console.log("DELETE announcement");
    console.log(req.params.id);
    Announcement.findOneAndRemove({_id: req.params.id}, function(err) {
      if(!err) {
        res.json(req.params.id);
      }
      else {
        console.log(err);
        res.json({err: err});
      }
    })
  })

  module.exports = announcements;

/** NO CRUD
announcements.get("/", function(req, res) {
  res.render("announcements");
})

announcements.get("/newAnnouncement", function(req, res) {
  res.render("newAnnouncement");
})

announcements.get("/delete", function(req, res) {
  res.render("announcementDelete");
})

announcements.get("/all", function(req, res) {
    Announcement.find({}, function(err, announcementsGot) {
        if (err)
        res.sendStatus(500)
        else
          res.status(200).json(announcementsGot)
      })
})

announcements.get("/view/:id", function(req, res) {
  Announcement.find({_id: req.params.id}, function(err, announcementGot) {
    if(err)
      res.sendStatus(500)
    else
    {
      console.log(announcementGot);
      res.status(200).render("announcementView", {announcement: announcementGot});
    }
  })
})
*/
