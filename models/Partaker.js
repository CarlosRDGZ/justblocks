const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const partakerSchema = new Schema({
  idUser: { type: String, ref:'User', required: true },
  idProject: { type: String, ref: 'Project', required: true }
  // idRol: { type: Number, required: true }
})

const Partaker = mongoose.model('Partaker', partakerSchema)
module.exports.Partaker = Partaker