// Note.js
import React, { useState, useEffect } from 'react';
import '../styles/Note.css';


// Definimos el componente Note que recibe props para manipular y visualizar una nota
function Note({ note, deleteNote, updateNote }) {
  // Estado que indica si la nota está en modo de edición
  const [isEditing, setIsEditing] = useState(false);
  // Estado que almacena los detalles de la nota que está siendo editada
  const [editedNote, setEditedNote] = useState({ ...note });

  useEffect(() => {
    setEditedNote({ ...note }); // Actualiza el estado cuando el note prop cambie
  }, [note]);
  // Función para habilitar el modo de edición
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Función para cancelar la edición y restaurar los datos originales de la nota
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedNote({ ...note });
  };

  // Función para guardar las ediciones hechas a la nota y desactivar el modo de edición
  const handleSaveEdit = () => {
    updateNote(note._id, editedNote);
    setIsEditing(false);
  };

  // Función para manejar cambios en los campos de entrada de la nota durante la edición
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedNote(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Función para manejar cambios en los ítems de la lista de la nota
  const handleChangeListItem = (index, value) => {
    const updatedItems = [...editedNote.items];
    updatedItems[index] = value;
    setEditedNote(prevState => ({
      ...prevState,
      items: updatedItems
    }));
  };

  // Función para manejar cambios en las URLs de imágenes asociadas con la nota
  const handleChangeImageUrl = (index, value) => {
    const updatedImages = [...editedNote.images];
    updatedImages[index] = value;
    setEditedNote(prevState => ({
      ...prevState,
      images: updatedImages
    }));
  };

  // Función para eliminar un ítem de la lista
const handleDeleteItem = index => {
  setEditedNote(prevState => ({
      ...prevState,
      items: prevState.items.filter((item, idx) => idx !== index)
  }));
};

// Función para eliminar una imagen
const handleDeleteImage = index => {
  setEditedNote(prevState => ({
      ...prevState,
      images: prevState.images.filter((image, idx) => idx !== index)
  }));
};

return (
  <div className="note-container">
      {isEditing ? (
          <div>
              <input
                  type="text"
                  name="title"
                  value={editedNote.title}
                  onChange={handleChange}
                  className="note-title"
              />
              <textarea
                  name="content"
                  value={editedNote.content}
                  onChange={handleChange}
                  className="note-content"
              />
              <div>
                  {editedNote.items.map((item, index) => (
                      <div key={index} className="note-items">
                          <input
                              type="text"
                              value={item}
                              onChange={(e) => handleChangeListItem(index, e.target.value)}
                          />
                          <button onClick={() => handleDeleteItem(index)} className="delete-button">X</button>
                      </div>
                  ))}
                  <button onClick={() => handleChangeListItem(editedNote.items.length, '')} className="add-button">
                      + Añadir Ítem
                  </button>
              </div>
              <div>
                  {editedNote.images.map((url, index) => (
                      <div key={index} className="note-images">
                          <input
                              type="text"
                              value={url}
                              onChange={(e) => handleChangeImageUrl(index, e.target.value)}
                          />
                          <button onClick={() => handleDeleteImage(index)} className="delete-button">X</button>
                      </div>
                  ))}
                  <button onClick={() => handleChangeImageUrl(editedNote.images.length, '')} className="add-button">
                      + Add Image
                  </button>
              </div>
              <button onClick={handleSaveEdit} className="note-save-button">
                  Save
              </button>
              <button onClick={handleCancelEdit} className="note-delete-button">
                  Cancel
              </button>
          </div>
      ) : (
          <div>
              <h2 className="note-title">{note.title}</h2>
              <p className="note-content">{note.content}</p>
              {note.items.map((item, index) => (
                  <li key={index}>{item}</li>
              ))}
              {note.images.map((url, index) => (
                  <img key={index} src={url} alt="Imagen de nota" className="note-image" />
              ))}
              <button onClick={handleEditClick} className="note-button">
                  Edit
              </button>
              <button onClick={() => deleteNote(note._id)} className="note-delete-button">
                  Delete
              </button>
          </div>
      )}
  </div>
);


}

export default Note;
