const mongoose = require('mongoose')
const Schema = mongoose.Schema

const projectSchema = new Schema({
  idAnnouncement: { type: Schema.Types.ObjectId, ref: 'Announcement' },
  idCreator: { type: Schema.Types.ObjectId, ref: 'User' },
  description: { type: String },
  score: Number
})

const Project = mongoose.model('Project', projectSchema)
module.exports.Project = Project