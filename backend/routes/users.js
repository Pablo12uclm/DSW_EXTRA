// routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); 
const authController = require('../controllers/authController');
const roleCheck = require('../middleware/roleCheck');
const isAuthenticated = require('../middleware/isAuthenticated');

// Mantener las rutas de registro y login
router.post('/register', userController.register);
router.post('/login', authController.login);

// Rutas para la gestión de usuarios con control de acceso por roles
router.get('/current', isAuthenticated, userController.getCurrentUser);
router.get('/', isAuthenticated, roleCheck.requireRole('Admin'), userController.getUsers);
router.put('/:id', isAuthenticated, userController.updateUser);
router.delete('/:id', isAuthenticated, userController.deleteUser);

module.exports = router;
