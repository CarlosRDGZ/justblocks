const mongoose = require('mongoose')
const Schema = mongoose.Schema

const projectsEvaluatorSchema = new Schema({
  idEvaluator: { type: Schema.Types.ObjectId, ref: 'Evaluator' },
  idProject: { type: Schema.Types.ObjectId, ref: 'Project' },
  idAnnouncement: { type: Schema.Types.ObjectId, ref: 'Announcement' },
  grade: { type: Number, default: -1},
  index: {type: Number, default: 0}//Como las calificaciones tienen que ser enviadas
  	//En orden cuando se calculan las calificaciones ajustadas usamos este índice para ordenarlas
})

const ProjectsEvaluator = mongoose.model('ProjectsEvaluator', projectsEvaluatorSchema)
module.exports.ProjectsEvaluator = ProjectsEvaluator