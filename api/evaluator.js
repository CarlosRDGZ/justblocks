const evaluators = require('express').Router()
const Evaluator = require('../models/Evaluator').Evaluator
const Project = require('../models/Project').Project
const ProjectsEvaluator = require('../models/projectsEvaluator').ProjectsEvaluator
const bodyParser = require('body-parser')

evaluators.use(bodyParser.urlencoded({ extended: true }))
evaluators.use(bodyParser.json()) 

evaluators.route('/')
  .post((req,res) => {
    const evaluator = new Evaluator(req.body.evaluator)
    evaluator.save()
      .then(data => res.json(data))
      .catch(err => res.status(400).json(err))
  })
  .get((req, res) => {
    Evaluator.find({})
      .populate('idUser', ['name', '_id', 'email'])
      .exec((err, all) => {
        if(err) {console.log(err); res.status(500).json({err: err});}
        else
          res.json(all);
      })
  })

evaluators.route('/:id')
  .get((req, res) => {
    let id = req.params.id;
    Evaluator.findById(id)
      .populate('idUser', ['name', '_id', 'email'])
      .exec((err, evaluator) => {
        if(err) {console.log(err); res.status(500).json({err: err});}
        else
          res.json(evaluator);
      })
  })
  .delete((req,res) => {
    let id = req.params.id
    Evaluator.findByIdAndRemove(id, (err,data) => {
      if (err) res.status(400).json(err)
      res.json(data)
    })
  })
  .put((req, res) => { //Actualizar sólo el status del evaluador
    let id = req.params.id;
    Evaluator.update({ _id: id }, { $set: req.params.status }, {new: true}, (err, evaluator) => {
      if(err) {console.log(err); res.status(500).json({err: err});}
      else
        res.json(evaluator);
    })
  })

evaluators.route('/announcement/:idAnnoun')
  .get((req, res) => {
    console.log('GET evaluators announcement')
    Evaluator.find({idAnnouncement: req.params.idAnnoun})
      .populate('idUser', ['name', '_id', 'email'])
      .exec((err, evaluatorsAnnoun) => {
        if(err) {console.log(err); res.status(500).json({err: err});}
        else
          res.json(evaluatorsAnnoun);
      })
  })

evaluators.route('/announcement/count/:idAnnoun')
  .get((req, res) => {
    Evaluator.count({idAnnouncement: req.params.idAnnoun}, (err, evaluatorsAnnoun) => {
      if(err) {console.log(err); res.status(500).json({err: err});}
      else
        res.json({evaluatorsAmount: evaluatorsAnnoun});
    })
  })

evaluators.route('/announcement/qualified/:idAnnoun')
  .get((req, res) => {
    console.log("Evaluator api, qualified announcement");
    let idAnnoun = req.params.idAnnoun;
    Evaluator.find({ idAnnouncement: idAnnoun })
      .populate('idUser', ['_id', 'name', 'email'])
      .exec((err, evaluatorsAnnoun) => {
        if(err) {console.log("Evaluators error"); console.log(err.message); res.status(500).json({err: err});}
        else {
          getQualifiedProjectsEvaluators(evaluatorsAnnoun, idAnnoun)
            .then(data => {
              //Ordenarlos con base al índice en que los asignó R
              for( let i = 0; i < data.length; i++ ) {
                for( let j = 0; j < data.length - 1 - i; j++ ) {
                  if( data[ j ].index > data[ j + 1 ].index ) {
                    let aux = data[ j ];
                    data[ j ] = data[ j + 1 ];
                    data[ j + 1 ] = aux;
                  }
                }
              }
              res.json({evaluators: evaluatorsAnnoun, allEvaluatorsProjects: data});
            })
            .catch(err => {console.log("Evaluators error"); console.log(err.message); res.status(500).json({err: err})})
        }
      })
  })

evaluators.route('/announcement/asignedProject/:idAnnoun')
  .get((req, res) => {
    console.log("Evaluator api, asignedProject");
    let idAnnoun = req.params.idAnnoun;
    Evaluator.find({ idAnnouncement: idAnnoun })
      .populate('idUser', ['_id', 'name', 'email'])
      .exec((err, evaluatorsAnnoun) => {
        if(err) {console.log("Evaluators error"); console.log(err.message); res.status(500).json({err: err});}
        else {
          getAllProjectsEvaluators(evaluatorsAnnoun, idAnnoun)
            .then(data => {
              //Ordenarlos en base al índice con que fueron asignados por R
              for( let i = 0; i < data.projectsEvalutor.length; i++ ) {
                for( let j = 0; j < data.projectsEvalutor.length - 1 - i; j++ ) {
                  if( data.projectsEvalutor[ j ].index > data.projectsEvalutor[ j + 1 ].index ) {
                    let aux = data.projectsEvalutor[ j ];
                    data.projectsEvalutor[ j ] = data.projectsEvalutor[ j + 1 ];
                    data.projectsEvalutor[ j + 1 ] = aux;
                  }
                }
              }

              //Para devolver una matriz donde cada fila tenga la cantidad exacta de proyectos de cada evaluador
              let projectIndex = 1;
              let currentPro = [];
              let allEvaluatorProjects = []
              data.projectsEvalutor.forEach(proj => {
                currentPro.push(proj);
                if(data.projectsPerEvaluator == projectIndex) {
                    projectIndex = 0;
                    allEvaluatorProjects.push(currentPro);
                    currentPro = []; 
                  } 
                  projectIndex++;
              })

              res.json({evaluators: evaluatorsAnnoun, allEvaluatorProjects: allEvaluatorProjects});
            })
            .catch(err => {console.log("Evaluators error"); console.log(err.message); res.status(500).json({err: err})})
        }
      })
  })
/*
evaluators.route('/:idEvaluator/qualify/:idProject')
  .put((req, res) => {//req.body.grade debe ser un json de la forma {grade: 8}
    console.log(req.body);
    ProjectsEvaluator.update({idEvaluator: req.params.idEvaluator, idProject: req.params.idProject}, {$set: req.body})
      .then(result => {
        res.json(result);
      })
      .catch(err => {console.log(err.message); res.status(500).json({err: err.message});});
  })*/

evaluators.route('/:idEval/projects')
  .get((req, res) => {
    console.log('GET evaluator projects')
    ProjectsEvaluator.find({idEvaluator: req.params.idEval})
      .populate('idProject', ['_id', 'description', 'title'])
      .exec()
      .then(projectsGot => {
        res.json(projectsGot);
      })
      .catch(err => {console.log('ProjectsEvaluator error'); console.log(err.message); res.status(500).json({err: err.message});})
  })
function getAllProjectsEvaluators(evaluatorsAnnoun, idAnnoun) {
  return new Promise((resolve, reject) => {
    console.log('getAllProjectsEvaluators');
    let allEvaluatorProjects = []
    let itemsProcessed = 0;
    evaluatorsAnnoun.forEach(evalu => {
      ProjectsEvaluator.find({ idEvaluator: evalu._id, idAnnouncement: idAnnoun })
        .populate('idProject')
        .exec((err, projectsGot) => {
          if(err) {console.log("ProjectsEvaluator error"); console.log(err); reject({err: err});}
          else {
            projectsGot.forEach(currentPro => {
              allEvaluatorProjects.push(currentPro);
            })
            itemsProcessed++;
            console.log(itemsProcessed)
            if(itemsProcessed == evaluatorsAnnoun.length)
              resolve({projectsEvalutor: allEvaluatorProjects, projectsPerEvaluator: projectsGot.length});
          }
        })
    })
  })
}

function getQualifiedProjectsEvaluators(evaluatorsAnnoun, idAnnoun) {
  return new Promise((resolve, reject) => {
    console.log('getQualifiedProjectsEvaluators');
    let allEvaluatorsProjects = []
    let itemsProcessed = 0;
    evaluatorsAnnoun.forEach(evalu => {
      ProjectsEvaluator.find({ idEvaluator: evalu._id, idAnnouncement: idAnnoun })
        .populate('idProject')
        .exec((err, projectsGot) => {
        if(err) {console.log("ProjectsEvaluator error"); console.log(err); reject({err: err});}
        else {
          let total = 0;
          let qualified = 0;
          projectsGot.forEach(currentPro => {
            if(currentPro.grade > -1) {
              qualified++;
            }
            total++;
          })
          allEvaluatorsProjects.push({projects: total, qualified: qualified, index: projectsGot[0].index});
          itemsProcessed++;
          if(itemsProcessed == evaluatorsAnnoun.length)
            resolve(allEvaluatorsProjects)
        }
      })
    })
  });
}

/*
const  getQualifiedProjectsEvaluators = async (evaluatorsAnnoun, idAnnoun) => {
  try {
    const promise = evaluatorsAnnoun.map(async (evalu) => {
      return await ProjectsEvaluator.find({ idEvaluator: evalu._id, idAnnouncement: idAnnoun }).populate('idProject')
    })
    const allEvaluatorsProjects = await Promise.all(promise)
    const qualified =  allEvaluatorsProjects.map((currentPro) => currentPro.grade > -1)
    return qualified
  } catch (err) {
     console.log("ProjectsEvaluator error");
     console.log(err);
  }
}
*/

module.exports = evaluators