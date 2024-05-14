import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig'; // Verifica que la ruta sea correcta
import { useNavigate } from 'react-router-dom';

const Collections = () => {
    const [collections, setCollections] = useState([]);
    const [newCollectionName, setNewCollectionName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        try {
            const response = await axios.get('/collections');
            setCollections(response.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                navigate('/login');  // Redirige al login si no está autenticado
            }
            console.error('Error fetching collections:', error);
        }
    };

    const handleCreateCollection = async () => {
        try {
            const response = await axios.post('/collections', { name: newCollectionName });
            setCollections([...collections, response.data]);
            setNewCollectionName('');
        } catch (error) {
            console.error('Error creating collection:', error);
        }
    };

    const handleDeleteCollection = async (id) => {
        try {
            await axios.delete(`/collections/${id}`);
            setCollections(collections.filter(collection => collection._id !== id));
        } catch (error) {
            console.error('Error deleting collection:', error);
        }
    };

    return (
        <div>
            <input
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="Enter new collection name"
            />
            <button onClick={handleCreateCollection}>Add Collection</button>
            <ul>
                {collections.map(collection => (
                    <li key={collection._id}>
                        {collection.name}
                        <button onClick={() => handleDeleteCollection(collection._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Collections;
