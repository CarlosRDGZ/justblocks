const evaluators = require('express').Router()
const Evaluator = require('../models/evaluator').Evaluator
const Project = require('../models/project').Project
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
    Evaluator.find({}, (err, all) => {
      if(err) {console.log(err); res.status(500).json({err: err});}
      else
        res.json(all);
    })
  })

evaluators.route('/:id')
  .get((req, res) => {
    let id = req.params.id;
    Evaluator.findById(id, (err, evaluator) => {
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
    Evaluator.update({ _id: id }, { $set: req.params.status }, (err, evaluator) => {
      if(err) {console.log(err); res.status(500).json({err: err});}
      else
        res.json(evaluator);
    })
  })

evaluators.route('/announcement/:idAnnoun')
  .get((req, res) => {
    Evaluator.find({idAnnouncement: req.params.idAnnoun}, (err, evaluatorsAnnoun) => {
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
          getAllEvaluators(evaluatorsAnnoun, idAnnoun)
            .then(data => {res.json(data);} )
            .catch(err => {console.log("Evaluators error"); console.log(err.message); res.status(500).json({err: err})})
        }
      })
  })

function getAllEvaluators(evaluatorsAnnoun, idAnnoun) {
  return new Promise((resolve, reject) => {
    console.log('getAllEvaluators');
    let allEvaluators = []
    let allEvaluatorProjects = []
    let itemsProcessed = 0;
    evaluatorsAnnoun.forEach(evalu => {
      ProjectsEvaluator.find({ idEvaluator: evalu._id, idAnnouncement: idAnnoun }, (err, projectsGot) => {
        if(err) {console.log("ProjectsEvaluator error"); console.log(err); reject({err: err});}
        else {
          let total = 0;
          let qualified = 0;
          projectsGot.forEach(currentPro => {
            if(currentPro.grade != -1)
                qualified++;
              total++;
          })
          allEvaluators.push(evaluatorsAnnoun[itemsProcessed]);
          allEvaluatorsProjects.push({projects: total, qualified: qualified});
          itemsProcessed++;
          console.log(itemsProcessed)
          if(itemsProcessed == evaluatorsAnnoun.length)
            resolve({allEvaluators: allEvaluators, allEvaluatorsProjects: allEvaluatorsProjects})
        }
      })
    })
  });
}

module.exports = evaluators