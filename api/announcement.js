const announcements = require('express').Router()
//Models
const Announcement = require('../models/Announcement').Announcement;
const Project = require('../models/Project').Project;
const ProjectsEvaluator = require('../models/projectsEvaluator').ProjectsEvaluator;
const Evaluator = require('../models/Evaluator').Evaluator;
const FileAnnouncement = require('../models/FileAnnouncement').FileAnnouncement;

//Middlewares
const announFindMiddleware = require("../middlewares/findAnnouncement");
const bodyParser = require('body-parser')

const fs = require('fs');
const cron = require('node-cron');
const formidable = require("express-form-data");
const mongoose = require('../database/config')
const path = require('path')
const mv = require('mv')

//npm install --save express-form-data
//npm install --save node-cron
announcements.use(formidable.parse({keepExtensions: true}));

announcements.use(bodyParser.urlencoded({ extended: true }))
announcements.use(bodyParser.json())

//will run every day at 01:00 AM
//Para este entonces ya debió de haberse definido una k válida
cron.schedule('0 0 1 * * *', () => {
  let today = new Date();
  Announcement.find({evaluationDate: today}).then(announs => {
    announs.forEach(announ => {
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
                      idAnnouncement: idAnnoun,
                        index: i++,
                        grade: getRandomInt(5, 11)//Para puebas, borrar en producción :v
                        //grade: -1
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
    })
  })
  .catch(err => {console.log("Cron error"); console.log(Date.now());})
})

//Habilitar middleware en producción
// announcements.use('/:id*', announFindMiddleware);
  
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

/**
 *  Bajo el concepto de api de deberia hacer de las siguiente
 * manera. Nada debe asumirse por datos del seridor, para que
 * sea escalable.
 */
announcements.route('/user/:id')
  .get((req, res) => {
    Announcement.find({idCreator: req.params.id}, function(err, data) {
      if(err) res.status(400).json({err: err})
      res.json(data); //Todas las convocatorias del usuario
    })
  })
/*
announcements.route('/user')
  .get((req, res) => {
    console.log("GET user's announcements");
    console.log(req.session.user_id);
    Announcement.find({idCreator: req.session.user_id}).populate('image', 'extension').exec( function(err, announcementsGot) {
      if(err){res.status(400).json({err: err})}
      res.json(announcementsGot);//Todas las comvocatorias del usuario
    })
  })
*/

//Return the 9 announcements recenter
announcements.route('/newest')
  .get((req, res) => {
    console.log('newest announcements')
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
            else{
              res.status(200).json(announs);
            }
        })
      }
    })
  })

announcements.route('/search/:str')
  .get((req, res) => {
    console.log('GET search announcements');
    Announcement.find({$text: {$search: req.params.str}})
      .populate('image')
      .exec()
      .then(announs => {
        res.json(announs);
      })
      .catch(err => {console.log('Get Announcement error'); console.log(err.message); res.status(500).json({err: err.message});})
  })

announcements.route('/abiertas')
  .get((req, res) => {
    console.log('GET announcement abiertas');
    let today = new Date();
    Announcement.find({evaluationDate: {$gt: today}})
      .populate('image')
      .exec()
      .then(announs => {
        res.json(announs);
      })
      .catch(err => {console.log('Get announcements abiertas error'); console.log(err.message); res.status(500).json({err: err.message});})
  })

announcements.route('/terminadas')
  .get((req, res) => {
    console.log('GET announcement cerradas');
    let today = new Date();
    Announcement.find({deadlineDate: {$lte: today}})
      .populate('image')
      .exec()
      .then(announs => {
        res.json(announs);
      })
      .catch(err => {console.log('Get announcements abiertas error'); console.log(err.message); res.status(500).json({err: err.message});})
  })

//Subir la imagen de presentación de la convocatoria
announcements.route('/image/:idAnnoun')
  .post((req, res) => {
    console.log("POST image announcement");
    let extension = req.files.image.name.split(".").pop();
    let image = new FileAnnouncement({
      owner: req.params.idAnnoun,
      extension: extension,
      typeFile: req.files.image.type
    });
    console.log(image);
    image.save(err => {
      if(!err) {
        // https://stackoverflow.com/questions/44146393/error-exdev-cross-device-link-not-permitted-rename-nodejs?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
        // error con rename
        // fs.rename(req.files.image.path, path.join(gRootDir,`public/files/announcement/images/${image._id}.${extension}`), err => console.log(err));
        // falto parametro callback
        mv(req.files.image.path, // source
          path.join(gRootDir,`public/files/announcement/images/${image._id}.${extension}`), // destiny
          err => err ? console.log(err) : console.log('file moved')) // callback
        Announcement.findByIdAndUpdate(req.params.idAnnoun, { $set: {image: image._id } },(err,data) => {
            if (err)
              res.status(400).json({err: err.message});
            else
              res.json(data);
          })
      } else {
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
        if(req.session.user_id == announ.idCreator) {
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
        }
        else {
            res.status(403).json({err: 'Sólo el creador puede modiifcar la imagen'});
        }
      })
      .catch(err => {console.log(err.message); res.status(500).json({err: err.message});})  
  })
  .delete((req, res) => {
    console.log("DELETE image announcement");
    FileAnnouncement.find({owner: req.params.idAnnoun})
      .populate('owner', 'idCreator')
      .exec((err, image) => {
        if(err){console.log("No tenía imagen"); res.json({err: "No tenía imagen: " + err.message });}
        if(req.session.user_id == req.params.idAnnoun) {
          fs.unlink("public/files/announcement/images/" + image[0]._id + "." + image[0].extension, (err) => {
            if(err){console.log("Tenía imagen pero hubo problema al eliminarla: " + err.message); res.status(500).json({announcement: data, err: "Tenía imagen pero hubo problema al eliminarla: " + err.message});}
            image[0].remove(err => {
              if(err){console.log("Problema al eliminar imagen de la DB: " + err.message); res.status(500).json({announcement: data, err: "Problema al eliminar imagen de la DB " + err.message});}
              res.status(200).json({announcement: data, image: image});
            })
          })
        }
        else {
          console.log("No permission"); 
          res.json({err: "Sólo el creador de la convocatoria puede eliminar la imagen"});
        }
      })
  })

announcements.route('/:id')
  .get((req, res) => {
      console.log("GET announcements by id");
      Announcement.findById({_id: req.params.id})
        .populate('image', 'extension').exec(function(err, announ) {
          if(err) res.status(404).json(err)
          else
            res.json(announ);
      })
  })
  .put((req, res) => {
    console.log("PUT announcement");
    if(!res.locals.permission)//Quitar la negación en producción
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
            projectsEvaluatedTimes: data.projectsEvaluatedTimes,
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
    if(res.locals.permission) {
      Announcement.findByIdAndRemove(req.params.id, (err,data) => {
      if (err) res.status(400).json(err)
        //Borrar la imagen si existe
        FileAnnouncement.find({owner: req.params.id})
          .then(image => {
            fs.unlink("public/files/announcement/images/" + image[0]._id + "." + image[0].extension, (err) => {
              if(err){console.log("Tenía imagen pero hubo problema al eliminarla: " + err.message); res.status(500).json({announcement: data, err: "Tenía imagen pero hubo problema al eliminarla: " + err.message});}
              image[0].remove(err => {
                if(err){console.log("Problema al eliminar imagen de la DB: " + err.message); res.status(500).json({announcement: data, err: "Problema al eliminar imagen de la DB " + err.message});}
                res.status(200).json({announcement: data, image: image});
              })
            })
          })
          .catch(err => {console.log("No tenía imagen"); res.json({announcement: data, err: "No tenía imagen: " + err.message });})
      })
    }
    else
      res.status(403).json({err: "Acceso denegado"});
  })

/*********************R section**********************/
//Asignación de proyectos con R (Sólo pruebas, se usar´´a cron.schedule)
//Para este entonces ya debemos tener asignada la cantidad de proyectos por evaluador
//No se podrá acceder a ella, se accederá cuando llegue la fecha, debe ser una función
announcements.get('/R/projectsAssign/:idAnnoun', (req, res) => {
  console.log('Announcement R projectsAssign');
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
                  let i = 0;
                  trtPerBlock = JSON.parse(out.toString());
                  let gradesPrueba = [9, 8, 10, 9, 9, 9, 7, 6, 6, 8, 7, 7, 3, 6, 4, 6, 5, 5, 2, 2, 1, 0, 3, 2, 8, 7, 8, 8, 8, 8];
                  trtPerBlock.forEach((current, index) => {
                    current.forEach(trt => {
                      let projectsEvaluator = new ProjectsEvaluator({
                        idEvaluator: blocks[index]._id,
                        idProject: treatments[trt - 1]._id,
                        idAnnouncement: idAnnoun,
                        index: i,
                        grade: gradesPrueba[i++]//Para puebas, borrar en producción :v
                        // grade: getRandomInt(5, 11)//Para puebas, borrar en producción :v
                        //grade: -1
                      })

                      projectsEvaluator.save()
                        .then(data => {console.log(i);})
                        .catch(err => {console.log("Err projectsEvaluator"); console.log(err);})
                    })
                  })
                  console.log("**************");
                  console.log(trtPerBlock);
                  console.log("**************");
                  // console.log(out.toString())
                  console.log(`child process exited with code ${code}`);
                  res.send(JSON.parse(out.toString()))
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

//Debuggin function: Retorna un entero aleatorio entre min (incluido) y max (excluido) 
function getRandomInt(min, max) {return Math.floor(Math.random() * (max - min)) + min;}

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

//Get all the possible values of r and k
function getRsAndKsAnnouncement(idAnnoun) {
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
            
            let i = trtCount % 2 == 0 || blocksCount % 2 == 0 ? 2 : 3; //Si t o b son pares se empieza en 2 
            for(i; i < trtCount; i++) {
              let tempK = i * trtCount / blocksCount;
              if( tempK <= trtCount) {//K nunca puede ser mayor a t
                if(tempK % 1 == 0) { //K debe ser entero
                  rs.push(i);
                  ks.push(tempK);
                }
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

announcements.get('/possibleRsAndKs/:idAnnoun', (req, res) => {
  console.log('Get possibleRsAndKs');
  Announcement.findById(req.params.idAnnoun)
    .then(announ => {
      let today = new Date();
      //ya no está en la etapa de registro
      if(announ.evaluationDate <= today) {
        getRsAndKsAnnouncement(req.params.idAnnoun).
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