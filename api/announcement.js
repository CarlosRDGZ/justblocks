const announcements = require('express').Router()
const Announcement = require('../models/Announcement').Announcement;
const Project = require('../models/project').Project;
const ProjectsEvaluator = require('../models/projectsEvaluator').ProjectsEvaluator;
const Evaluator = require('../models/evaluator').Evaluator;
const FileAnnouncement = require('../models/FileAnnouncement').FileAnnouncement;
const bodyParser = require('body-parser')
const fs = require('fs');
const cron = require('node-cron');
const formidable = require("express-form-data");
const mongoose = require('../database/config')
const announFindMiddleware = require("../middlewares/findAnnouncement");

//will run every day at 01:00 AM
cron.schedule('0 0 1 * * *', () => {
  Announcement.find({}).then(announs => {
    announs.forEach(announ => {
      let today = new Date();
      if(announ.evaluationDate == today) {
        let idAnnoun = announ._id;
        let treatments = [];
        let treatmentsCount = 0;
        let blocks = [];
        let blocksCount = 0;
        //Para este entonces ya debió de haberse definido una k válida
        let trtPerBlockCount = announ.projectsPerEvaluator;
        let trtPerBlock;

        Project.find({idAnnouncement: idAnnoun})
          .then(projects => {
            Evaluator.find({idAnnouncement: idAnnoun})
              .then(evaluators => {
                treatments = projects;
                treatmentsCount = projects.length;
                blocks = evaluators;
                blocksCount = evaluators.length;

                const { spawn } = require('child_process');
                const child = spawn('Rscript', ['C:/Users/brand/source/repos/justblocks/BIBANOVA/projectsAssign.R', treatmentsCount, blocksCount, trtPerBlockCount]);

                let out = ''
                let err = ''
                child.stdout.on('data', (chunk) => {
                  out += chunk
                });

                child.stderr.on('data', (chunk) => {
                  err += chunk
                })

                child.on('close', (code) => {
                  if (err) {console.log('STDERR:\n', err.toString()); console.log(Date.now());}
                  let i = 0;
                  trtPerBlock = JSON.parse(out.toString());
                  trtPerBlock.forEach((current, index) => {
                    current.forEach(trt => {
                      let projectsEvaluator = new ProjectsEvaluator({
                        idEvaluator: blocks[index]._id,
                        idProject: treatments[trt - 1]._id,
                        idAnnouncement: idAnnoun
                      })

                      projectsEvaluator.save()
                        .then(data => {console.log(++i);})
                        .catch(err => {console.log("Err projectsEvaluator"); console.log(err);})
                    })
                  })
                  console.log(`child process exited with code ${code}`);
                  console.log("Proyectos asignados a la convocatoria: " + idAnnoun);
                });
              })
              .catch(err => {console.log("Evaluator error"); console.log(err); res.status(500).json({err: err})})
          })
          .catch(err => {console.log("Project error"); console.log(err); res.status(500).json({err: err})})
      }
    })
  })
  .catch(err => {console.log("Cron error"); console.log(Date.now());})
})


//npm install --save express-form-data
//npm install --save node-cron
announcements.use(formidable.parse({keepExtensions: true}));

announcements.use(bodyParser.urlencoded({ extended: true }))
announcements.use(bodyParser.json())

// announcements.use('/user', announFindMiddleware);
announcements.use('/:id*', announFindMiddleware);
  
announcements.route('/')
  .get((req,res) => {
    console.log("GET announcement");
    Announcement.find({}).populate('image', 'extension').exec( function(err, all) {
      if(err){res.status(400).json({err: err})}
      res.json(all);//Todas las comvocatorias del usuario
    })
  })
  .post((req,res) => {
      console.log("POST announcement: " + req.session.user_id);
      const data = req.body;
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
    Announcement.find({idCreator: req.session.user_id}).populate('image', 'extension').exec( function(err, announcementsGot) {
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
        Announcement.find({}, null, {skip: c - 9})
          .populate('image', 'extension').exec(function(err, announs) {
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

        Announcement.findByIdAndUpdate(req.params.idAnnoun, {$set: {image: image._id } },
          (err,data) => {
            if (err) res.status(400).json({err: err.message});
            else
              res.json(data);
          }
        )
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
  .put((req, res) => {
    console.log("PUT image announcement");
    Announcement.findById(req.params.idAnnoun)
      .populate('image')
      .then(announ => {
        if(announ.image) {
          var newExtension = req.files.image.name.split(".").pop();
          
          let beforeName = announ.image._id + '.' + announ.image.extension;
          announ.image.extension = newExtension;
          announ.image.save(function(err, image) {
            if(!err) {
              if(fs.existsSync("public/files/announcement/images/" + image._id + "." + newExtension)) {
                fs.rename(req.files.image.path, "public/files/announcement/images/" + image._id + "." + newExtension);
                console.log("Tenía la misma extension");
              }
              else {
                console.log("Tenía diferente extension");
                fs.rename(req.files.image.path, "public/files/announcement/images/" + image._id + "." + newExtension);
                //Borrar la imagen anterior
                fs.unlink("public/files/announcement/images/" + beforeName, (err) => {
                  if(err){console.log(err.message); res.status(500).json({err: err.message});}
                })
                res.sendStatus(200);
              }
            }
            else {
              console.log(err);
              res.status(500).json({err: err});
            }
          })
        }
        else {
          res.status(404).json({err: 'La convocatoria actualemente no tiene imagen'});
        }
      })
      .catch(err => {console.log(err.message); res.status(500).json({err: err.message});})  
  })

announcements.route('/:id')
  .get((req, res) => {
      console.log("GET announcements by id");
      Announcement.find({_id: req.params.id})
        .populate('image', 'extension').exec(function(err, announcementGot) {
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

/*********************R section**********************/
//Asignación de proyectos con R
//Para este entonces ya debemos tener asignada la cantidad de proyectos por evaluador
//No se podrá acceder a ella, se accederá cuando llegue la fecha, debe ser una función
//function projectsAssign(idAnnoun)
announcements.get('/R/projectsAssign/:idAnnoun', (req, res) => {
  console.log('projectsAssign');
  Announcement.findById(req.params.idAnnoun)
    .then(announ => {
      let today = new Date();
      if(announ.evaluationDate <= today) {
        let idAnnoun = req.params.idAnnoun
        let treatments = []
        let treatmentsCount = 0
        let blocks = []
        let blocksCount = 0
        let trtPerBlock
        let trtPerBlockCount = 0

        Project.find({idAnnouncement: idAnnoun})
          .then(projects => {
            Evaluator.find({idAnnouncement: idAnnoun})
              .then(evaluators => {
                treatments = projects;
                treatmentsCount = projects.length;
                blocks = evaluators;
                blocksCount = evaluators.length;
                let trtPerBlockCount = announ.projectsPerEvaluator;

                console.log("R 1");
                const { spawn } = require('child_process');
                const child = spawn('Rscript', ['C:/Users/brand/source/repos/justblocks/BIBANOVA/projectsAssign.R', treatmentsCount, blocksCount, trtPerBlockCount]);

                let out = ''
                let err = ''
                console.log("R 2");
                child.stdout.on('data', (chunk) => {
                  out += chunk
                });

                console.log("R 3");
                child.stderr.on('data', (chunk) => {
                  err += chunk
                })

                console.log("R 4");
                child.on('close', (code) => {
                  if (err) console.log('STDERR:\n', err.toString())
                  //res.json(JSON.parse(out.toString()))
                  let i = 0;
                  trtPerBlock = JSON.parse(out.toString());
                  trtPerBlock.forEach((current, index) => {
                    current.forEach(trt => {
                      let projectsEvaluator = new ProjectsEvaluator({
                        idEvaluator: blocks[index]._id,
                        idProject: treatments[trt - 1]._id,
                        idAnnouncement: idAnnoun
                      })

                      projectsEvaluator.save()
                        .then(data => {console.log(++i);})
                        .catch(err => {console.log("Err projectsEvaluator"); console.log(err);})
                    })
                  })
                  console.log("**************");
                  console.log(trtPerBlock);
                  console.log("**************");
                  // console.log(out.toString())
                  console.log(`child process exited with code ${code}`);
                  res.send(out.toString())
                });
              })
              .catch(err => {console.log("Evaluator error"); console.log(err); res.status(500).json({err: err})})
          })
          .catch(err => {console.log("Project error"); console.log(err); res.status(500).json({err: err})})
      }
      else {
        console.log("Fecha de evaluación mayor a la actual"); 
        res.status(403).json({err: 'La fecha de evaluación todavía no ha llegado'});
      }
    })
    .catch(err => {console.log("Announcement error"); console.log(err.message); res.status(500).json({err: err.message});})
})

announcements.route('/setK/:idAnnoun')
  .get((req, res) => {
    Announcement.findById(req.params.idAnnoun)
      .then(announ => {
        //if(función para Validar K) announ.projectsPerEvaluator
          //function projectsAssign(idAnnoun)
        //else
          //Error
      })
      .catch(err => {console.log("Announcement error"); console.log(err.message); res.status(500).json({err: err.message});})
  })

//No funciona, en caso de encontrar la condición correcta, corregir
//The necessary conditions for the existence are that bk/trt and bk(k−1)/(trt(trt−1)) positive integers.
function getPossibleK(idAnnoun) {
  return new Promise((resolve, reject) => {
    let trtCount = 100
    let blocksCount = 30
    let ks = []
    Project.count({idAnnouncement: idAnnoun})
      .then(projectNumber => {
        // trtCount = projectNumber; console.log("trtCount: " + trtCount);
        Evaluator.count({idAnnouncement: idAnnoun})
          .then(evaluatorNumber => {
            // blocksCount = evaluatorNumber; 
            console.log("blocksCount: " + blocksCount);
            for (let i = 1; i <= blocksCount; i++) {
              let condition1 = (blocksCount * i) / trtCount;
              console.log("condition1: " + condition1)
              let condition2 = (blocksCount * i * (i - 1)) / (trtCount * (trtCount - 1))
              console.log("condition2: " + condition2)
              //Enteros positivos
              if(condition1 > 0 && condition1 % 1 == 0 && condition2 > 0 && condition2 % 1 == 0)  {
                ks.push(i);
                console.log("DENTRO: ", i)
              }
            }
            console.log(ks);
            resolve({
              projects: trtCount,
              evaluators: blocksCount,
              possibleK: ks
            });
          })
          .catch(err => {console.log("Project error"); console.log(err.message); reject({err: err.message})})
      })
    .catch(err => {console.log("Project error"); console.log(err.message); reject({err: err.message})})
  })
}

//Get all the possible values of r
function getRsAnnouncement(idAnnoun) {
  return new Promise((resolve, reject) => {
    let trtCount = 0
    let blocksCount = 0
    let rs = []
    let ks = []
    Project.count({idAnnouncement: idAnnoun})
      .then(projectNumber => {
        trtCount = projectNumber; console.log("trtCount: " + trtCount);
        Evaluator.count({idAnnouncement: idAnnoun})
          .then(evaluatorNumber => {
            blocksCount = evaluatorNumber; console.log("blocksCount: " + blocksCount);
            
            for(let i = 1; i < trtCount; i++) {
              let tempK = i * trtCount / blocksCount;
              if( tempK <= trtCount) {//K nunca puede ser mayor a t
                rs.push(i);
                ks.push(tempK);
              }
              else 
                break;
            }

            console.log(rs);
            console.log(ks);
            resolve({
              projects: trtCount,
              evaluators: blocksCount,
              possibleK: ks,
              possibleR: rs
            });
          })
          .catch(err => {console.log("Project error"); console.log(err.message); reject({err: err.message})})
      })
    .catch(err => {console.log("Project error"); console.log(err.message); reject({err: err.message})})
  })
}

// getRsAnnouncement('5af8fdd8b3a4a5373494fa7d');

announcements.get('/possibleK/:idAnnoun', (req, res) => {
  console.log('Get possibleK');
  Announcement.findById(req.params.idAnnoun)
    .then(announ => {
      let today = new Date();
      //ya no está en la etapa de registro
      if(announ.evaluationDate <= today) {
        getPossibleK(req.params.idAnnoun).
          then(result => {
            res.json(result); 
          })
          .catch(err => {console.log("Announcement error"); console.log(err.message); res.status(500).json({err: err.message});})
      }
      else {
        console.log("Fecha de evaluación mayor a la actual"); 
        res.status(403).json({err: 'La fecha de evaluación todavía no ha llegado'});
      }
    })
    .catch(err => {console.log("Announcement error"); console.log(err.message); res.status(500).json({err: err.message});})
})

announcements.get('/possibleRsAndKs/:idAnnoun', (req, res) => {
  console.log('Get possibleRsAndKs');
  Announcement.findById(req.params.idAnnoun)
    .then(announ => {
      let today = new Date();
      //ya no está en la etapa de registro
      if(announ.evaluationDate <= today) {
        getRsAnnouncement(req.params.idAnnoun).
          then(result => {
            res.json(result); 
          })
          .catch(err => {console.log("Announcement error"); console.log(err.message); res.status(500).json({err: err.message});})
      }
      else {
        console.log("Fecha de evaluación mayor a la actual"); 
        res.status(403).json({err: 'La fecha de evaluación todavía no ha llegado'});
      }
    })
    .catch(err => {console.log("Announcement error"); console.log(err.message); res.status(500).json({err: err.message});})
})

module.exports = announcements;