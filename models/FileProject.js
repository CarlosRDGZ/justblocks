var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fileProjectSchema = new Schema({ 
	owner: {type: Schema.Types.ObjectId, ref: "Project"},
	extension: {type: String, required: true}
	typeFile: {type: String, required: true}
});

var FileProject = mongoose.model("FileProject", fileProjectSchemaSchema);

module.exports.FileProject = FileProject;