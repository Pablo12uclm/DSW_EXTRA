// controllers/notesController.js
const Note = require('../models/note'); // Asegúrate de que la ruta al modelo es correcta
const User = require('../models/User'); // Asegúrate de que la ruta al modelo de usuario es correcta
const SharedNote = require('../models/SharedNote');

exports.getAllNotes = async (req, res) => {
  try {
      // Obtener los ID de todos los usuarios que NO son administradores
      const nonAdminUsers = await User.find({ role: { $ne: 'Admin' } }).select('_id');
      const userIds = nonAdminUsers.map(user => user._id);

      // Usar los ID obtenidos para filtrar las notas
      const notes = await Note.find({ user: { $in: userIds } });
      res.status(200).json(notes);
  } catch (err) {
      console.error('Failed to fetch notes:', err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getUserNotes = async (req, res) => {
  try {
      // Asumiendo que req.user contiene el ID del usuario autenticado
      const userId = req.user.id; 
      console.log('Fetching notes for user ID:', userId); // Log del userId para debug
      const notes = await Note.find({ user: userId }); // Filtra notas por el ID de usuario
      if (notes.length === 0) {
        console.log('No notes found for user ID:', userId); // Log si no se encuentran notas
    }
      res.status(200).json(notes);
  } catch (err) {
      console.error('Failed to fetch notes:', err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createNote = async (req, res) => {
  try {
      const { title, content, items, images, collection } = req.body;
      const note = new Note({
          title,
          content,
          items,
          images,
          collection: collection || null, // Asegurarse de manejar la ausencia de una colección
          user: req.user.id
      });
      await note.save();
      res.status(201).json(note);
  } catch (error) {
      console.error('Error creating note:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findByIdAndUpdate(id, req.body, { new: true });
    if (!note) {
      return res.status(404).json({ message: 'Nota no encontrada' });
    }
    res.json(note);
  } catch (err) {
    console.error('Error al actualizar la nota:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Método para eliminar una nota
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findByIdAndDelete(id);
    if (!note) {
      return res.status(404).json({ message: 'Nota no encontrada' });
    }
    res.json({ message: 'Nota eliminada' });
  } catch (err) {
    console.error('Error al eliminar la nota:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Método para compartir una nota
exports.shareNote = async (req, res) => {
  try {
    const { noteId, friendId } = req.body;

    // Verificar si la nota ya ha sido compartida con este usuario
    const existingSharedNote = await SharedNote.findOne({ note: noteId, sharedWith: friendId });
    if (existingSharedNote) {
      return res.status(400).json({ error: 'The note has already been shared with this user' });
    }

    const sharedNote = new SharedNote({
      note: noteId,
      sharedWith: friendId,
      sharedBy: req.user.id
    });

    await sharedNote.save();
    res.status(201).json(sharedNote);
  } catch (error) {
    res.status(500).json({ error: 'Error sharing note' });
  }
};

// Método para obtener las notas compartidas con el usuario
exports.getSharedNotes = async (req, res) => {
  try {
    const sharedNotes = await SharedNote.find({ sharedWith: req.user.id }).populate('note');
    res.json(sharedNotes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching shared notes' });
  }
};