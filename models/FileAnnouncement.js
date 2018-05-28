const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileAnnouncementSchema = new Schema({ 
	owner: {type: Schema.Types.ObjectId, ref: "Announcement"},
	extension: {type: String, required: true},
	typeFile: {type: String, required: true}
});

const FileAnnouncement = mongoose.model("FileAnnouncement", fileAnnouncementSchema);

module.exports.FileAnnouncement = FileAnnouncement;