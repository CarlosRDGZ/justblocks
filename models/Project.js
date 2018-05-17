const mongoose = require('mongoose')
const Schema = mongoose.Schema

const projectSchema = new Schema({
  idAnnouncement: { type: Schema.Types.ObjectId, ref: 'Announcement' },
  idCreator: { type: Schema.Types.ObjectId, ref: 'User' },
  description: { type: String },
  title: { type: String },
  score: Number,
  grade: { type: Number, default: -1},//El promedio de las calificaciones obtenidas de todos los evaluadores
  adjustedGrade: Number
})

delete mongoose.models.Project;
const Project = mongoose.model('Project', projectSchema)
module.exports.Project = Project