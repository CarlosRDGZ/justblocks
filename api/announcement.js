const announcements = require('express').Router()
const Announcement = require('../models/announcement').Announcement;
const bodyParser = require('body-parser')
const sessionMiddleware = require('./middlewares/session');//Para validar los usuarios

announcements.use(bodyParser.urlencoded({ extended: true }))
announcements.use(bodyParser.json())


router.get("/all", function(req, res) {
    Announcement.find({}, function(err, announcementsGot) {
        if (err)
        res.sendStatus(500)
        else
          res.status(200).json(announcements)
      })
})

app.use("/announcement", sessionMiddleware);

announcements.route('/announcement')
  .get((req,res) => {
    Announcement.find({idCreator: res.locals.user._id}, function(err, announcementsGot) {
      if(err){res.redirect("/app"); return;}
      res.render("");//Todas las comvocatorias del usuario
    })
  })
  .post((req,res) => {
      var body = req.body;
      var announcement = new Announcement({
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

//Editar y borrar
announcements.all("/announcement/:id*", image_finder_middleware);

module.exports = announcements;