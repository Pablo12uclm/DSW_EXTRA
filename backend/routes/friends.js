const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');
const isAuthenticated = require('../middleware/isAuthenticated');

// Ruta para enviar una solicitud de amistad
router.post('/requests', isAuthenticated, friendController.sendFriendRequest);

// Ruta para aceptar una solicitud de amistad
router.post('/requests/:requestId/accept', isAuthenticated, friendController.acceptFriendRequest);

// Ruta para rechazar una solicitud de amistad
router.post('/requests/:requestId/reject', isAuthenticated, friendController.rejectFriendRequest);

// Ruta para obtener todas las solicitudes de amistad pendientes
router.get('/requests', isAuthenticated, friendController.getFriendRequests);

// Ruta para obtener todos los amigos de un usuario
router.get('/', isAuthenticated, friendController.getFriends);

// Ruta para obtener todos los usuarios
router.get('/users', isAuthenticated, friendController.getAllUsers);

module.exports = router;