// routes/notes.js

const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');
const isAuthenticated = require('../middleware/isAuthenticated');

router.get('/', isAuthenticated, notesController.getAllNotes);
router.get('/user', isAuthenticated, notesController.getUserNotes);
router.post('/', isAuthenticated, notesController.createNote);
router.put('/:id', isAuthenticated, notesController.updateNote);
router.delete('/:id', isAuthenticated, notesController.deleteNote);

module.exports = router;