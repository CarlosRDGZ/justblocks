var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var documentProjectSchema = new Schema({ 
	owner: {type: Schema.Types.ObjectId, ref: "Announcement"},
	extension: {type: String, required: true},
	typeFile: {type: String, required: true}, 
	name: {type: String, required: true}
});

var DocumentProject = mongoose.model("DocumentProject", documentProjectSchema);

module.exports.DocumentProject = DocumentProject;