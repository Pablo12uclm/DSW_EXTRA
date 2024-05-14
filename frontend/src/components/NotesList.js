import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';  // Asegúrate de importar tu configuración personalizada de Axios
import Note from './Note';
import NoteForm from './NoteForm';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCog } from '@fortawesome/free-solid-svg-icons';

import '../styles/App.css';
import '../styles/Note.css';


function NotesList() {
  const [notes, setNotes] = useState([]);
  const [allUsersNotes, setAllUsersNotes] = useState([]);  // Nuevo estado para almacenar todas las notas de usuarios no admin
  const [isAdmin, setIsAdmin] = useState(false);  // Nuevo estado para verificar si el usuario es admin

  const fetchNotes = () => {
    axios.get('/notes/user')
      .then(response => setNotes(response.data))
      .catch(error => console.error('Error fetching notes:', error));
  };

   // Función para obtener las notas de todos los usuarios no admin
   const fetchAllUsersNotes = () => {
    axios.get('/notes')
      .then(response => setAllUsersNotes(response.data))
      .catch(error => console.error('Error fetching all user notes:', error));
  };

  const handleNoteAdded = (newNote) => {
    setNotes(prevNotes => [...prevNotes, newNote]);
  };

  const addNote = (note) => {
    axios.post('/notes', note)
      .then(response => {
        console.log('Note added successfully:', response.data);
        // Asegurarse de que la respuesta del servidor contiene los datos correctos
        if (response.data && response.status === 201) {
          // Método 1: Agregar la nueva nota al estado
          setNotes(prevNotes => [...prevNotes, response.data]);
        } else {
          throw new Error('Invalid server response');
        }
      })
      .catch(error => {
        console.error('Error adding note:', error);
      });
  };
  

  const updateNote = (id, updatedNote) => {
    axios.put(`/notes/${id}`, updatedNote)
    .then(response => {
        console.log("Respuesta después de actualizar:", response.data);
        // Aquí actualizamos el estado con la nota actualizada
        setNotes(prevNotes => prevNotes.map(note => note._id === id ? { ...note, ...response.data } : note));
    })
    .catch(error => {
        console.error('Error al actualizar la nota:', error);
    });
  };

  const deleteNote = (id) => {
    axios.delete(`/notes/${id}`)
    .then(() => {
      fetchNotes(); // Recargar las notas después de eliminar
    })
    .catch(error => console.error('Error deleting note:', error));
  };

  useEffect(() => {
    fetchNotes();
    const role = localStorage.getItem('role');  // Obtiene el rol del usuario desde localStorage
    console.log('Rol recuperado desde localStorage:', role);  // Log para verificar el rol recuperado

    if (role === 'Admin') {
      setIsAdmin(true);  // Establece isAdmin a true si el usuario es administrador
      fetchAllUsersNotes();  // Llama a la función para obtener todas las notas si el usuario es admin
    } else {
      setIsAdmin(false);  // Establece isAdmin a false si el usuario no es admin
    }
  }, []);

  return (
    <div>
      <div className="note-management-link">
        <Link to="/manage-users" className="note-management-button">
          <FontAwesomeIcon icon={faUserCog} /> User Management
        </Link>
      </div>
      <h1>Create Note</h1>
      <NoteForm addNote={addNote} onNoteAdded={handleNoteAdded} />
      <div className="notes-flex-container">  {/* Añadida esta nueva clase */}
        <div className="my-notes">
          <h1>My Notes</h1>
          {notes.map(note => (
            <Note
              key={note._id}
              note={note}
              deleteNote={() => deleteNote(note._id)}
              updateNote={updateNote}
            />
          ))}
        </div>
        {isAdmin && (
          <div className="users-notes">
            <h1>Users Notes</h1>
            {allUsersNotes.map(note => (
              <Note
                key={note._id}
                note={note}
                deleteNote={() => deleteNote(note._id)}
                updateNote={updateNote}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};



export default NotesList;
