const Collection = require('../models/collection'); // Asegúrate de que la ruta al modelo es correcta
const User = require('../models/User'); // Asegúrate de que la ruta al modelo de usuario es correcta
const Note = require('../models/note'); // Asegúrate de que la ruta al modelo de nota es correcta

exports.getAllCollections = async (req, res) => {
  try {
      // Obtener los ID de todos los usuarios que NO son administradores
      const nonAdminUsers = await User.find({ role: { $ne: 'Admin' } }).select('_id');
      const userIds = nonAdminUsers.map(user => user._id);

      // Usar los ID obtenidos para filtrar las colecciones
      const collections = await Collection.find({ user: { $in: userIds } });
      res.status(200).json(collections);
  } catch (err) {
      console.error('Failed to fetch collections:', err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getUserCollections = async (req, res) => {
  try {
      // Asumiendo que req.user contiene el ID del usuario autenticado
      const userId = req.user.id; 
      console.log('Fetching collections for user ID:', userId); // Log del userId para debug
      const collections = await Collection.find({ user: userId }); // Filtra colecciones por el ID de usuario
      if (collections.length === 0) {
        console.log('No collections found for user ID:', userId); // Log si no se encuentran colecciones
      }
      res.status(200).json(collections);
  } catch (err) {
      console.error('Failed to fetch collections:', err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createCollection = async (req, res) => {
  try {
      const { name } = req.body;
      const userId = req.user.id; // Asegúrate de que el middleware isAuthenticated está siendo usado en esta ruta.

      const newCollection = new Collection({
          name,
          user: userId // Añadir el userId
      });

      await newCollection.save();
      res.status(201).json(newCollection);
  } catch (err) {
      console.error('Failed to create collection:', err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const collection = await Collection.findByIdAndUpdate(id, req.body, { new: true });
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    res.json(collection);
  } catch (err) {
    console.error('Error updating collection:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const collection = await Collection.findByIdAndDelete(id);
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    res.json({ message: 'Collection deleted' });
  } catch (err) {
    console.error('Error deleting collection:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Nuevo método para obtener las notas de una colección específica
exports.getNotesByCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const notes = await Note.find({ collection: id });
    res.status(200).json(notes);
  } catch (err) {
    console.error('Failed to fetch notes for collection:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Nuevo método para obtener las colecciones de otros usuarios
exports.getAllUserCollections = async (req, res) => {
  try {
    // Obtener las colecciones de todos los usuarios que no son administradores
    const nonAdminUsers = await User.find({ role: { $ne: 'Admin' } }).select('_id username');
    const userIds = nonAdminUsers.map(user => user._id);

    const collections = await Collection.find({ user: { $in: userIds } }).populate('user', 'username');
    res.status(200).json(collections);
  } catch (err) {
    console.error('Failed to fetch collections:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};