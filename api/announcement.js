const announcements = require('express').Router()
const Announcement = require('../models/Announcement').Announcement;
const FileAnnouncement = require('../models/FileAnnouncement').FileAnnouncement;
const bodyParser = require('body-parser')
const fs = require('fs');
const formidable = require("express-form-data");

const mongoose = require('../database/config')
const announFindMiddleware = require("../middlewares/findAnnouncement");

//npm install --save express-form-data
announcements.use(formidable.parse({keepExtensions: true}));

announcements.use(bodyParser.urlencoded({ extended: true }))
announcements.use(bodyParser.json())

// announcements.use('/user', announFindMiddleware);
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

announcements.route('/user')
  .get((req, res) => {
    console.log("GET user's announcements");
    console.log(req.session.user_id);
    Announcement.find({idCreator: req.session.user_id}, function(err, announcementsGot) {
      if(err){res.status(400).json({err: err})}
      res.json(announcementsGot);//Todas las comvocatorias del usuario
    })
  })

//Devuelve las 9 convocatorias más recientes
announcements.route('/newest')
  .get((req, res) => {
    Announcement.count({}, function(err, c) {
      if(err){res.status(500).json({err: err});}
      else
      {
        //Cuando haya menos de 9 convocatorias las va a regresar todas
        if(c < 9)
          c = 9; 
        Announcement.find({}, null, {skip: c - 9}, function(err, announs) {
          if(err){res.status(500).json({err: err});}
          else
            res.status(200).json(announs);
        })
      }
    })
  })

//Subir la imagen de presentación de la convocatoria
announcements.route('/image/:idAnnoun')
  .post((req, res) => {
    console.log("POST image announcement");
    var extension = req.files.image.name.split(".").pop();
    var image = new FileAnnouncement({
      owner: req.params.idAnnoun,
      extension: extension,
      typeFile: req.files.image.type
    });

    console.log(image);

    image.save(function(err) {
      if(!err) {
        fs.rename(req.files.image.path, "public/files/announcement/images/" + image._id + "." + extension );
        res.sendStatus(200);
      }
      else {
        console.log(err);
        res.status(500).json({err: err});
      }
    })
  })
  .get((req, res) => {
    console.log("GET IMAGE");
    FileAnnouncement.find({owner: req.params.idAnnoun}, function(err, image) {
      if(!err) {
        res.status(200).json(image[0]);
        console.log(image[0]);
      }
      else {
        console.log(err);
        res.sendStatus(500);
      }

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

module.exports = announcements;