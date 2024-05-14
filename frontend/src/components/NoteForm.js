import React, { useState } from 'react';
import axios from '../axiosConfig'; // Asegúrate de importar correctamente axiosConfig
import '../styles/Note.css';
import '../styles/App.css';


function NoteForm({ onNoteAdded }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [items, setItems] = useState(['']);
    const [images, setImages] = useState(['']);

    const handleAddItem = () => {
        setItems([...items, '']);
    };

    const handleItemChange = (index, value) => {
        const newItems = [...items];
        newItems[index] = value;
        setItems(newItems);
    };

    const handleAddImage = () => {
        setImages([...images, '']);
    };

    const handleImageChange = (index, value) => {
        const newImages = [...images];
        newImages[index] = value;
        setImages(newImages);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/notes', {
                title,
                content,
                items: items.filter(item => item.trim() !== ''),
                images: images.filter(image => image.trim() !== '')
            });
            console.log('Note created:', response.data);
            onNoteAdded(response.data); // Llama a la callback con la nueva nota
            // Reset form after submission
            setTitle('');
            setContent('');
            setItems(['']);
            setImages(['']);
        } catch (error) {
            console.error('Error creating note:', error.response.data);
        }
    };

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Tittle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
                required
            />
            <textarea
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="form-input"
                required
            />
            {items.map((item, index) => (
                <input
                    key={index}
                    type="text"
                    placeholder="Item"
                    value={item}
                    onChange={(e) => handleItemChange(index, e.target.value)}
                    className="form-input"
                />
            ))}
            <button type="button" onClick={handleAddItem} className="form-button">Add Item</button>
            {images.map((image, index) => (
                <input
                    key={index}
                    type="text"
                    placeholder="URL de imagen"
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    className="form-input"
                />
            ))}
            <button type="button" onClick={handleAddImage} className="form-button">Add Image</button>
            <button type="submit" className="note-save-button">Save Note</button>
        </form>
    );
}

export default NoteForm;
