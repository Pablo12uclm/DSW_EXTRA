const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SharedNote = require('./SharedNote'); // Importa el modelo SharedNote

const noteSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  items: [String],
  images: [String],
  collection: { type: Schema.Types.ObjectId, ref: 'Collection', required: false }, // Hacer que collection sea opcional
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true } // Asegurarse de que user sea requerido
}, { timestamps: true });

// Middleware para eliminar registros de SharedNote relacionados
noteSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    await SharedNote.deleteMany({ note: doc._id });
  }
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
