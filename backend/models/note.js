// models/Note.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  items: [String],
  images: [String],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Agregando la referencia al usuario
}, { timestamps: true });

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
