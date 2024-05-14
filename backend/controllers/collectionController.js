const Collection = require('../models/collection');
const User = require('../models/User');

// POST: Crear nueva colección
exports.createCollection = async (req, res) => {
    const { name } = req.body;
    const userId = req.user.id;  // asumiendo que el middleware de autenticación añade el usuario a req

    try {
        const collection = new Collection({ name, user: userId });
        await collection.save();
        res.status(201).send(collection);
    } catch (error) {
        res.status(400).send(error);
    }
};

// PUT: Actualizar colección (añadir/quitar notas)
exports.updateCollection = async (req, res) => {
    const { collectionId, notes } = req.body;

    try {
        const collection = await Collection.findById(collectionId);
        if (!collection) {
            return res.status(404).send({ message: 'Collection not found' });
        }
        collection.notes = notes;  // Asumiendo que se envían todos los IDs de notas ya modificados
        await collection.save();
        res.send(collection);
    } catch (error) {
        res.status(400).send(error);
    }
};

// DELETE: Eliminar una colección
exports.deleteCollection = async (req, res) => {
    const { collectionId } = req.params;

    try {
        const collection = await Collection.findByIdAndDelete(collectionId);
        if (!collection) {
            return res.status(404).send({ message: 'Collection not found' });
        }
        res.send({ message: 'Collection deleted' });
    } catch (error) {
        res.status(500).send(error);
    }
};

// GET: Listar colecciones de un usuario
exports.getUserCollections = async (req, res) => {
    const userId = req.user.id;

    try {
        const collections = await Collection.find({ user: userId });
        res.send(collections);
    } catch (error) {
        res.status(500).send(error);
    }
};
