const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sharedNoteSchema = new Schema({
    note: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true },
    sharedWith: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sharedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const SharedNote = mongoose.model('SharedNote', sharedNoteSchema);

module.exports = SharedNote;
