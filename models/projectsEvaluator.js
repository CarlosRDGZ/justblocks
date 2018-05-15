const mongoose = require('mongoose')
const Schema = mongoose.Schema

const projectsEvaluatorSchema = new Schema({
  idEvaluator: { type: Schema.Types.ObjectId, ref: 'Evaluator' },
  idProject: { type: Schema.Types.ObjectId, ref: 'Project' },
  idAnnouncement: { type: Schema.Types.ObjectId, ref: 'Announcement' }
})

const ProjectsEvaluator = mongoose.model('ProjectsEvaluator', projectsEvaluatorSchema)
module.exports.ProjectsEvaluator = ProjectsEvaluator