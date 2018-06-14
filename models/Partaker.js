const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const partakerSchema = new Schema({
  idUser: { type: Schema.Types.ObjectId, ref:'User', required: true },
  idProject: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  rol: { type: String, enum:['Contestant', 'Owner', 'Admin'], required: true }
})

const Partaker = mongoose.model('Partaker', partakerSchema)
module.exports.Partaker = Partaker