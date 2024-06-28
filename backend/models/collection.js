const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionSchema = new Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Referencia al usuario
}, { timestamps: true });

const Collection = mongoose.model('Collection', collectionSchema);

module.exports = Collection;