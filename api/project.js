const projects = require('express').Router()
const Project = require('../models/Project').Project
const Announcement = require('../models/announcement').Announcement
const Evaluator = require('../models/evaluator').Evaluator
const ProjectsEvaluator = require('../models/projectsEvaluator').ProjectsEvaluator
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

/****************R SECTION**********************/ 
//Devuelve todos los proyectos de la convocatoria enviada ordenados por el índice generado al usar el modelo de asignación
//en un sólo vector, nota* todos los proyectos deben de haber sido ya evaluados
function getAllProjectsOfAnnoun(idAnnoun) {
  return new Promise((resolve, reject) => {
    console.log('getAllProjectsOfAnnoun');
    let allProjectsAnnoun = []
    let itemsProcessed = 0;
    ProjectsEvaluator.find({idAnnouncement: idAnnoun})
      .populate('idProject')
      .exec((err, projectsGot) => {
        if(err) {console.log("ProjectsEvaluator error"); console.log(err); reject({err: err});}
        else {
          projectsGot.forEach(currentPro => {allProjectsAnnoun.push(currentPro);})

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

projects.route('/mean/:idAnnoun')
  .get((req, res) => {
    console.log('mean/:idAnnoun');
    Announcement.findById(req.params.idAnnoun)
      .then(announ => {
        let today = new Date();
        if(announ.evaluationDate <= today) {//También validar que no se hayan calculado ya
          let idAnnoun = req.params.idAnnoun
          let allProjectsMean = []
          let projectsPerEvaluator = announ.projectsPerEvaluator;
          let itemsProcessed = 0;
           Project.find({ idAnnouncement: idAnnoun })
            .then(projectsAnnoun => {
              console.log("projectsAnnoun.length: ", projectsAnnoun.length)
              projectsAnnoun.forEach(proj => {
                calculateMean(proj._id, projectsPerEvaluator)
                  .then(mean => {
                    itemsProcessed++;
                    allProjectsMean.push(mean);
                    if(itemsProcessed == projectsAnnoun.length)
                      res.json({projects: projectsAnnoun, means: allProjectsMean})
                  })
                  .catch(err => {console.log("projectsAnnoun error mean"); console.log(err); res.status(500).json({err: err});})
                  console.log("itemsProcessed: ", itemsProcessed)
              })
            })
            .catch(err => {console.log("Project error mean"); console.log(err); res.status(500).json({err: err});})
        }
    })
  })

function calculateMean(idProj, projectsPerEvaluator) {
  console.log(idProj);
  return new Promise((resolve, reject) => {
    ProjectsEvaluator.find({ idProject: idProj })
      .then(projectsGot => {
          let sumGrades = 0;
          projectsGot.forEach(currentPro => {
            sumGrades += currentPro.grade;//Validar que sea diferente de -1
          })
          
          let proj = {grade: sumGrades / projectsPerEvaluator};
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

projects.route('/adjustedGrades/:idAnnoun')
  .get((req, res) => {
  console.log('adjustedGrades');
  Announcement.findById(req.params.idAnnoun)
    .then(announ => {
      let today = new Date();
      if(announ.evaluationDate <= today) {//También validar que no se hayan calculado ya
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
                  // res.json({t: treatmentsCount, b: blocksCount, k: trtPerBlockCount, projects: allProjects});
                  let grades = []
                  allProjects.forEach(currentPro => {grades.push(currentPro.grade)})
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

                    let adjustedGrades = [];
                    trtPerBlock.forEach(currentGrade => {adjustedGrades.push({adjustedGrade: currentGrade.emmean, index: currentGrade.project_Index - 1});})
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

module.exports = projects