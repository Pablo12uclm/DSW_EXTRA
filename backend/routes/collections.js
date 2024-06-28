const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController');
const isAuthenticated = require('../middleware/isAuthenticated');

// Ruta para crear una nueva colección
router.post('/', isAuthenticated, collectionController.createCollection);

// Ruta para actualizar una colección existente
router.put('/:collectionId', isAuthenticated, collectionController.updateCollection);

// Ruta para eliminar una colección
router.delete('/:collectionId', isAuthenticated, collectionController.deleteCollection);

// Ruta para obtener todas las colecciones de un usuario
router.get('/', isAuthenticated, collectionController.getUserCollections);

// Ruta para obtener las notas de una colección específica
router.get('/:id/notes', isAuthenticated, collectionController.getNotesByCollection);

// Ruta para obtener las colecciones de otros usuarios
router.get('/user-collections', isAuthenticated, collectionController.getAllUserCollections);

module.exports = router;
