import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import '../styles/Note.css'; // Asegúrate de tener los estilos necesarios

function NoteForm({ onNoteAdded }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [items, setItems] = useState(['']);
    const [images, setImages] = useState(['']);
    const [collections, setCollections] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState('');

    useEffect(() => {
        // Obtener las colecciones al cargar el componente
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        try {
            const response = await axios.get('/collections');
            setCollections(response.data);
        } catch (error) {
            console.error('Error fetching collections:', error);
        }
    };

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

    const handleCollectionChange = (event) => {
        setSelectedCollection(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/notes', {
                title,
                content,
                items: items.filter(item => item.trim() !== ''),
                images: images.filter(image => image.trim() !== ''),
                collection: selectedCollection
            });
            console.log('Note created:', response.data);
            onNoteAdded(response.data); // Llama a la callback con la nueva nota
            // Reset form after submission
            setTitle('');
            setContent('');
            setItems(['']);
            setImages(['']);
            setSelectedCollection(''); // Limpiar la colección seleccionada después de crear la nota
        } catch (error) {
            console.error('Error creating note:', error.response.data);
        }
    };

    return (
        <form className="note-form" onSubmit={handleSubmit}>
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
                    placeholder="Image URL"
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    className="form-input"
                />
            ))}
            <button type="button" onClick={handleAddImage} className="form-button">Add Image</button>
            {/* Combo box para seleccionar la colección */}
            <select value={selectedCollection} onChange={handleCollectionChange} className="form-input">
                <option value="">Select Collection</option>
                {collections.map(collection => (
                    <option key={collection._id} value={collection._id}>{collection.name}</option>
                ))}
            </select>
            <button type="submit" className="note-save-button">Save Note</button>
        </form>
    );
}

export default NoteForm;
