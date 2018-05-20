const mongoose = require('mongoose')
const Schema = mongoose.Schema

const projectSchema = new Schema({
  idAnnouncement: { type: Schema.Types.ObjectId, ref: 'Announcement' },
  idCreator: { type: Schema.Types.ObjectId, ref: 'User' },
  description: { type: String },
  title: { type: String },
  mean: { type: Number, default: -1},//El promedio de las calificaciones obtenidas de todos los evaluadores
  adjustedGrade: { type: Number, default: -1},
  group: {type: Number, default: -1}//El grupo al que pertenecen cuando se calculen los promedios ajustados
})

delete mongoose.models.Project;
const Project = mongoose.model('Project', projectSchema)
module.exports.Project = Project