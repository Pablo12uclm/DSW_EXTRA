import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import Note from './Note'; // Importa el componente Note
import '../styles/Collection.css';

const Collection = () => {
    const [collections, setCollections] = useState([]);
    const [userCollections, setUserCollections] = useState({});
    const [newCollectionName, setNewCollectionName] = useState('');
    const [notesByCollection, setNotesByCollection] = useState({});
    const [expandedCollection, setExpandedCollection] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
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

        const fetchUserCollections = async () => {
            try {
                const response = await axios.get('/collections/user-collections');
                const collectionsByUser = response.data.reduce((acc, collection) => {
                    const userId = collection.user._id;
                    if (!acc[userId]) {
                        acc[userId] = {
                            username: collection.user.username,
                            collections: []
                        };
                    }
                    acc[userId].collections.push(collection);
                    return acc;
                }, {});
                setUserCollections(collectionsByUser);
            } catch (error) {
                console.error('Error fetching user collections:', error);
            }
        };

        const checkAdmin = () => {
            const role = localStorage.getItem('role');
            setIsAdmin(role === 'Admin');
        };

        fetchCollections();
        checkAdmin();

        if (isAdmin) {
            fetchUserCollections();
        }
    }, [isAdmin, navigate]);

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
            setNotesByCollection(prevState => {
                const newState = { ...prevState };
                delete newState[id];
                return newState;
            });
        } catch (error) {
            console.error('Error deleting collection:', error);
        }
    };

    const fetchNotesByCollection = async (collectionId) => {
        try {
            const response = await axios.get(`/collections/${collectionId}/notes`);
            setNotesByCollection(prevState => ({
                ...prevState,
                [collectionId]: response.data
            }));
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    const handleToggleExpand = (collectionId) => {
        if (expandedCollection === collectionId) {
            setExpandedCollection(null);
        } else {
            setExpandedCollection(collectionId);
            if (!notesByCollection[collectionId]) {
                fetchNotesByCollection(collectionId);
            }
        }
    };

    const deleteNote = async (noteId) => {
        try {
            await axios.delete(`/notes/${noteId}`);
            setNotesByCollection(prevState => {
                const newState = { ...prevState };
                for (const collectionId in newState) {
                    newState[collectionId] = newState[collectionId].filter(note => note._id !== noteId);
                }
                return newState;
            });
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    const updateNote = async (noteId, updatedNote) => {
        try {
            const response = await axios.put(`/notes/${noteId}`, updatedNote);
            setNotesByCollection(prevState => {
                const newState = { ...prevState };

                // Encontrar la colección actual de la nota antes de la actualización
                const previousCollectionId = Object.keys(prevState).find(collectionId => 
                    prevState[collectionId].some(note => note._id === noteId)
                );

                // Remover la nota de la colección anterior si existe
                if (previousCollectionId) {
                    newState[previousCollectionId] = newState[previousCollectionId].filter(note => note._id !== noteId);
                }

                // Añadir la nota a la nueva colección si se especifica una colección
                if (updatedNote.collection) {
                    if (!newState[updatedNote.collection]) {
                        newState[updatedNote.collection] = [];
                    }
                    newState[updatedNote.collection].push(response.data);
                }

                return newState;
            });
        } catch (error) {
            console.error('Error updating note:', error);
        }
    };

    return (
        <div>
            <div className="note-management-links">
                <button onClick={() => navigate('/notes')} className="button collection-management-button">
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
        </div>
    );
};

export default Collection;
