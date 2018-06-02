const projects = require('express').Router()
const Project = require('../models/Project').Project
const Partaker = require('../models/Partaker').Partaker
const DocumentProject = require('../models/DocumentProject').DocumentProject
const Announcement = require('../models/Announcement').Announcement
const Evaluator = require('../models/Evaluator').Evaluator
const ProjectsEvaluator = require('../models/projectsEvaluator').ProjectsEvaluator
const bodyParser = require('body-parser')
const formidable = require("express-form-data");
const fs = require('fs');

projects.use(formidable.parse({keepExtensions: true}));
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
  .get((req,res) => {
    Project.findById(req.params.id, (err,data) => {
      if (err)
        res.status(400).json(err)
      res.json(data)
    })
  })
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

projects.route('/countProjects/:idAnnoun')
  .get((req, res) => {
      console.log("GET countProjects by idAnnoun");
      Project.count({idAnnouncement: req.params.idAnnoun}, (err, projects) => {
        if (err)
          res.status(400).json(err)
        else
          res.json({projects: projects});
      })
  })

projects.route('/projectsEvaluator/:idProject')
  .get((req, res) => {
    console.log("GET projectsEvaluator");
    ProjectsEvaluator.find({idProject: req.params.idProject})
      .then(data => {
        res.json(data);
      })
      .catch(err => {console.log("projectsEvaluator error"); console.log(err); res.status(500).json({err: err});})
  })

//Cuando se terminé la fecha de evaluación se tienen que calcular nos promedios "normales" para luego calcular los ajustados
projects.route('/calculateNormalMean/:idAnnoun')
  .get((req, res) => {
    ProjectsEvaluator.find({grade: - 1})
      .then(missingToEvaluate => { 
        if(missingToEvaluate.length > 0) {console.log("Faltan proyectos por evaluar"); res.status(403).json({err: "Faltan proyectos por evaluar", missingToEvaluate: missingToEvaluate});}
        else {
          //Quiere decir que todos los proyectos fueron evaluados
          console.log('mean/:idAnnoun');
          Announcement.findById(req.params.idAnnoun)
            .then(announ => {
              let today = new Date();
              if(announ.evaluationDate <= today) {//También validar que no se hayan calculado ya
                let idAnnoun = req.params.idAnnoun
                let allProjectsMean = []
                let projectsEvaluatedTimes = announ.projectsEvaluatedTimes;
                let itemsProcessed = 0;
                 Project.find({ idAnnouncement: idAnnoun })
                  .then(projectsAnnoun => {
                    console.log("projectsAnnoun.length: ", projectsAnnoun.length)
                    projectsAnnoun.forEach(proj => {
                      calculateMean(proj._id, projectsEvaluatedTimes)
                        .then(mean => {
                          Project.findByIdAndUpdate(proj._id, {$set: {mean: mean.grade}})
                            .then(result => {
                              console.log("MEAN: " + mean.grade);
                              itemsProcessed++;
                              if(itemsProcessed == projectsAnnoun.length) 
                                res.sendStatus(200);
                            })
                            .catch(err => {console.log("Project findByIdAndUpdate error"); console.log(err.message); res.status(500).json({err: err.message});})

                          allProjectsMean.push(mean);
                          console.log("itemsProcessed: ", itemsProcessed)
                          if(itemsProcessed == projectsAnnoun.length) {
                            /*Esto sólo era para las pruebas manuales
                            console.log("DENTRO itemsProcessed: " + itemsProcessed);
                            for(let i = 0; i < projectsAnnoun.length; i++) {
                              //Ordenarlos con base a su proyecto
                              console.log("i: " + i + " projectsAnnoun: " + projectsAnnoun[i]._id);
                              for(let j = 0; j < allProjectsMean.length; j++) {
                                if(projectsAnnoun[i]._id == allProjectsMean[j].idProject) {
                                  //Intercambiar el valor de mean en el indice del proyecto por el lugar que le corresponde
                                  let temp = allProjectsMean[i];
                                  allProjectsMean[i] = allProjectsMean[j];
                                  allProjectsMean[j] = temp;
                                  break;
                                }
                              }*/
                              res.json({projects: projectsAnnoun, means: allProjectsMean})
                            }
                        })
                        .catch(err => {console.log("projectsAnnoun error mean"); console.log(err); res.status(500).json({err: err});})
                    })
                  })
                  .catch(err => {console.log("Project error mean"); console.log(err); res.status(500).json({err: err});})
              }
              else {
                console.log("La fecha de evaluación aún no ha llegado"); 
                res.status(403).json({err: "La fecha de evaluación aún no ha llegado"});
              }
            })
            .catch(err => {console.log("Announcement error"); console.log(err.message); res.status(500).json({err: err.message});})
          }
      })
      .catch(err => {console.log("Projects missingToEvaluate error"); console.log(err.message); res.status(500).json({err: err.message});})
  })

function calculateMean(idProj, projectsEvaluatedTimes) {
  console.log(idProj);
  return new Promise((resolve, reject) => {
    ProjectsEvaluator.find({ idProject: idProj })
      .then(projectsGot => {
          let sumGrades = 0;
          projectsGot.forEach(currentPro => {
            sumGrades += currentPro.grade;
          })

          let proj = {grade: sumGrades / projectsEvaluatedTimes, idProject: idProj};
          console.log(proj);
          resolve(proj);//Guardar en la base de datos en el campo grade de project
      })
      .catch(err => {
        console.log("ProjectsEvaluator error"); 
        console.log(err); 
        reject({err: err});
      })
  })
}

/****************DOCUMENTS SECTION**********************/ 
projects.route('/document/:idProject')
  .post((req, res) => {//Validar que sólo lo puedan subir participantes
    console.log("POST document Project");
    let extension = req.files.document.name.split(".").pop();
    let name = req.files.document.name.substring(0, req.files.document.name.length - extension.length - 1);//Quitarle el punto y la extensión

    var doc = new DocumentProject({
      owner: req.params.idProject,
      extension: extension,
      typeFile: req.files.document.type,
      name: name
    });

    doc.save()
      .then(data =>{
        fs.rename(req.files.document.path, "public/files/projects/" + doc._id + "." + extension );
        res.json(data);
      })
      .catch(err =>{console.log("DocumentProject error"); console.log(err.message); res.status(500).json({err: err.message});})  
  })
  .get((req, res) => {
    console.log("GET all documents of project");
    DocumentProject.find({owner: req.params.idProject})
      .then(documents => {
        res.json(documents);
      })
      .catch(err =>{console.log("Find DocumentProject error"); console.log(err.message); res.status(500).json({err: err.message});})  
  })
  .delete((req, res) => {
    console.log("DELETE all documents of project");
    DocumentProject.find({owner: req.params.idProject})
      .then(documents => {
        // if(req.session.user_id == req.params.idAnnoun) { //Validar que sólo lo pueda eliminar el creador o partakers
          let itemsDeleted = 0;
          documents.forEach(currentDoc => {
            fs.unlink("public/files/projects/" + currentDoc._id + "." + currentDoc.extension, (err) => {
              if(err){console.log("Problemas para eliminar el archivo en el servidor: " + err.message); res.status(500).json({err: err.message});}
              currentDoc.remove(err => {
                if(err){console.log("Problema al eliminar el documento de la DB: " + err.message); res.status(500).json({err: err.message});}            
                itemsDeleted++; 
              })  
            })
            if(itemsDeleted >= documents.length)
                  res.send(200); 
          })
        // }
      })
      .catch(err => {console.log("DELETE documents of project error"); console.log(err.message); res.json({err: err.message });});
  })


/****************R SECTION**********************/ 
//Devuelve todos los proyectos de la convocatoria enviada ordenados por el índice generado al usar el modelo de asignación
//en un sólo vector, nota* todos los proyectos deben de haber sido ya evaluados
function getAllProjectsOfAnnoun(idAnnoun) {
  return new Promise((resolve, reject) => {
    console.log('getAllProjectsOfAnnoun');
    let itemsProcessed = 0;
    ProjectsEvaluator.find({idAnnouncement: idAnnoun})
      .populate('idProject')
      .exec((err, projectsGot) => {
        if(err) {console.log("ProjectsEvaluator error"); console.log(err); reject({err: err});}
        else {
          // projectsGot.forEach(currentPro => {allProjectsAnnoun.push(currentPro);})

          for( let i = 0; i < projectsGot.length; i++ ) {
            for( let j = 0; j < projectsGot.length - 1 - i; j++ ) {
              if( projectsGot[ j ].index > projectsGot[ j + 1 ].index ) {
                let aux = projectsGot[ j ];
                projectsGot[ j ] = projectsGot[ j + 1 ];
                projectsGot[ j + 1 ] = aux;
              }
            }
          }
          resolve(projectsGot);
        }
      })
  })
}

projects.route('/adjustedGrades/:idAnnoun')
  .get((req, res) => {
  console.log('adjustedGrades');
  Announcement.findById(req.params.idAnnoun)
    .then(announ => {
      let today = new Date();
      if(announ.evaluationDate <= today) {
        let idAnnoun = req.params.idAnnoun
        let treatments = []
        let treatmentsCount = 0
        let blocks = []
        let blocksCount = 0
        let trtPerBlockCount = 0

        Project.count({idAnnouncement: idAnnoun})
          .then(projectsCount => {
            Evaluator.count({idAnnouncement: idAnnoun})
              .then(evaluatorsCount => {
                getAllProjectsOfAnnoun(idAnnoun).then(allProjects => {
                  treatments = allProjects;
                  blocksCount = evaluatorsCount;
                  treatmentsCount = projectsCount;
                  let trtPerBlockCount = announ.projectsPerEvaluator;
                  // let trtPerBlockCount = 4;//Quitar en producción
                  let grades = []

                  allProjects.forEach(currentPro => {grades.push(currentPro.grade)})
                  console.log("grades.length; " + grades.length);
                  console.log(grades);
                  console.log(JSON.stringify(grades));
                  console.log("R 1");
                  const { spawn } = require('child_process');
                  const child = spawn('Rscript', [
                    'C:/Users/brand/source/repos/justblocks/BIBANOVA/qualifyProjects.R', 
                    treatmentsCount, 
                    blocksCount, 
                    trtPerBlockCount, 
                    JSON.stringify(grades)
                  ]);

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
                  console.log("t: ", treatmentsCount);
                  console.log("b: ", blocksCount);
                  console.log("k: ", trtPerBlockCount);
                  child.on('close', (code) => {
                    if (err) console.log('STDERR:\n', err.toString())
                    //res.json(JSON.parse(out.toString()))
                    let trtPerBlock = JSON.parse(out.toString());
                    console.log(trtPerBlock);
                    console.log("trtPerBlock.length: ", trtPerBlock.length);

                    //No salen ordenadas las calificaciones
                    for( let i = 0; i < trtPerBlock.length; i++ ) {
                      for( let j = 0; j < trtPerBlock.length - 1 - i; j++ ) {
                        if( trtPerBlock[ j ].project_Index - 1 > trtPerBlock[ j + 1 ].project_Index - 1) {
                          let aux = trtPerBlock[ j ];
                          trtPerBlock[ j ] = trtPerBlock[ j + 1 ];
                          trtPerBlock[ j + 1 ] = aux;
                        }
                      }
                    }

                    let adjustedGrades = [];
                    trtPerBlock.forEach(currentGrade => {
                      adjustedGrades.push({adjustedGrade: currentGrade.emmean, index: currentGrade.project_Index - 1, group: currentGrade['.group']});
                    })

                    //Actualizar adjustedGrade de todos los proyectos
                    Project.find({idAnnouncement: idAnnoun})
                      .then(projsAnn => {
                        projsAnn.forEach((current, index) => {
                          current.group = adjustedGrades[index]['group'].trim();
                          current.adjustedGrade = adjustedGrades[index].adjustedGrade;
                          current.save((err, proj) => {
                              if(err){console.log("Hubo un problema al guardar la calificación ajustada de un proyecto"); console.log(err.message); res.status(500).json({err: err.message}); }
                              else {
                                console.log(proj);
                              }
                          })
                        })
                      })
                      .catch(err => {console.log("Hubo un problema al buscar los proyectos"); res.status(500).json({err: "Hubo un problema al buscar los proyectos"});})

                    res.send(JSON.parse(JSON.stringify(adjustedGrades)))
                      console.log(`child process exited with code ${code}`);
                  })
                })
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

//When the adjustedGrade is calculated the groups are genererated an saved in each project
//this function order them by group, only the 1, 2 and 3 groups, the winners.
projects.route('/winners/:idAnnoun')
  .get((req, res) => {
    Project.find({idAnnouncement: req.params.idAnnoun})
      .then(projectsAnnoun => {
        //Get the winner groups
        let groups = new Array([], [], []);
        projectsAnnoun.forEach(proj => {
          for(let i = 0; i < proj.group.length; i++) {
            if(!isNaN(proj.group[i])) { //Es un número (sólo entre 1 y 3, ver qualifyProjects.R para más info)
              groups[proj.group[i] - 1].push(proj);
            }
          }
        })
        res.json(JSON.parse(JSON.stringify(groups)));
      })
      .catch(err => {console.log("getProjectsByGroup error"); console.log(err.message); res.status(500).json({err: err.message});})
  })

module.exports = projects