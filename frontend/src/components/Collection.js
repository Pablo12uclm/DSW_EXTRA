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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
        <div className="note-management-links">
                <button onClick={() => navigate('/notes')} className="user-management-button">
=======
            <div className="note-management-links">
                <button onClick={() => navigate('/notes')} className="button collection-management-button">
>>>>>>> Stashed changes
=======
            <div className="note-management-links">
                <button onClick={() => navigate('/notes')} className="button collection-management-button">
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
            <ul className="collection-list">
                {collections.map(collection => (
                    <li key={collection._id} className="collection-item">
                        <span>{collection.name}</span>
                        <button onClick={() => handleDeleteCollection(collection._id)} className="collection-delete-button">Delete</button>
                    </li>
                ))}
            </ul>
        </div>
=======
            <div className="collection-container">
                <h1>Create Collection</h1>
                <div className="collection-form">
                    <input
                        value={newCollectionName}
                        onChange={(e) => setNewCollectionName(e.target.value)}
                        placeholder="Enter new collection name"
                        className="collection-input"
                    />
                    <button onClick={handleCreateCollection} className="button collection-button">Add Collection</button>
                </div>
                <h2>My Collections</h2>
                <ul className="collection-list">
                    {collections.map(collection => (
                        <li key={collection._id} className="collection-item">
                            <div className="collection-header">
                                <span>{collection.name}</span>
                                <button onClick={() => handleToggleExpand(collection._id)} className="button expand-button">
                                    {expandedCollection === collection._id ? <FontAwesomeIcon icon={faChevronUp} /> : <FontAwesomeIcon icon={faChevronDown} />}
                                </button>
                                <button onClick={() => handleDeleteCollection(collection._id)} className="button collection-delete-button">Delete</button>
                            </div>
                            {expandedCollection === collection._id && (
                                <div className="notes-list">
                                    {notesByCollection[collection._id] ? (
                                        notesByCollection[collection._id].map(note => (
                                            <Note
                                                key={note._id}
                                                note={note}
                                                deleteNote={() => deleteNote(note._id)}
                                                updateNote={updateNote}
                                                canShare={true} // Permite compartir en "My Collections"
                                            />
                                        ))
                                    ) : (
                                        <p>Loading notes...</p>
                                    )}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
                {isAdmin && (
                    <>
                        <h2>Users Collections</h2>
                        {Object.keys(userCollections).map(userId => (
                            <div key={userId}>
                                <h3 className="user-name">{userCollections[userId].username}</h3> {/* Clase CSS aplicada */}
                                <ul className="collection-list">
                                    {userCollections[userId].collections.map(collection => (
                                        <li key={collection._id} className="collection-item">
                                            <div className="collection-header">
                                                <span>{collection.name}</span>
                                                <button onClick={() => handleToggleExpand(collection._id)} className="button expand-button">
                                                    {expandedCollection === collection._id ? <FontAwesomeIcon icon={faChevronUp} /> : <FontAwesomeIcon icon={faChevronDown} />}
                                                </button>
                                            </div>
                                            {expandedCollection === collection._id && (
                                                <div className="notes-list">
                                                    {notesByCollection[collection._id] ? (
                                                        notesByCollection[collection._id].map(note => (
                                                            <Note
                                                                key={note._id}
                                                                note={note}
                                                                deleteNote={() => deleteNote(note._id)}
                                                                updateNote={updateNote}
                                                                canShare={false} // No permite compartir en "Users Collections"
                                                            />
                                                        ))
                                                    ) : (
                                                        <p>Loading notes...</p>
                                                    )}
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </>
                )}
            </div>
>>>>>>> Stashed changes
        </div>
    );
};

export default Collection;
