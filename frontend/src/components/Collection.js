import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { useNavigate, Link } from 'react-router-dom'; // Importa Link desde react-router-dom
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import '../styles/Collection.css';

const Collection = () => {
    const [collections, setCollections] = useState([]);
    const [newCollectionName, setNewCollectionName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const response = await axios.get('/collections');
                setCollections(response.data);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    navigate('/login');
                }
                console.error('Error fetching collections:', error);
            }
        };
    
        fetchCollections(); // Llama a la función dentro del efecto
    
    }, []);

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
        <div className="note-management-links">
                <button onClick={() => navigate('/notes')} className="user-management-button">
                    <FontAwesomeIcon icon={faArrowLeft} /> Back to Notes
                </button>
        </div>
        <div className="collection-container">
            <h1>Create Collection</h1>
            <div className="collection-form">
                <input
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder="Enter new collection name"
                    className="collection-input"
                />
                <button onClick={handleCreateCollection} className="collection-button">Add Collection</button>
            </div>
            <ul className="collection-list">
                {collections.map(collection => (
                    <li key={collection._id} className="collection-item">
                        <span>{collection.name}</span>
                        <button onClick={() => handleDeleteCollection(collection._id)} className="collection-delete-button">Delete</button>
                    </li>
                ))}
            </ul>
        </div>
        </div>
    );
};

export default Collection;
