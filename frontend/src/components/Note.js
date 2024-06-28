import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import '../styles/Note.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons';

function Note({ note, deleteNote, updateNote, canShare }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedNote, setEditedNote] = useState({ ...note });
    const [collections, setCollections] = useState([]);
    const [showShare, setShowShare] = useState(false);
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState('');
    const [shareError, setShareError] = useState('');

    useEffect(() => {
        setEditedNote({ ...note });
        fetchCollections();
        fetchFriends();
    }, [note]);

    const fetchCollections = async () => {
        try {
            const response = await axios.get('/collections');
            setCollections(response.data);
        } catch (error) {
            console.error('Error fetching collections:', error);
        }
    };

    const fetchFriends = async () => {
        try {
            const response = await axios.get('/friends');
            setFriends(response.data);
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedNote({ ...note });
    };

    const handleSaveEdit = () => {
        updateNote(note._id, editedNote);
        setIsEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedNote(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleChangeListItem = (index, value) => {
        const updatedItems = [...editedNote.items];
        updatedItems[index] = value;
        setEditedNote(prevState => ({
            ...prevState,
            items: updatedItems
        }));
    };

    const handleChangeImageUrl = (index, value) => {
        const updatedImages = [...editedNote.images];
        updatedImages[index] = value;
        setEditedNote(prevState => ({
            ...prevState,
            images: updatedImages
        }));
    };

    const handleDeleteItem = (index) => {
        setEditedNote(prevState => ({
            ...prevState,
            items: prevState.items.filter((item, idx) => idx !== index)
        }));
    };

    const handleDeleteImage = (index) => {
        setEditedNote(prevState => ({
            ...prevState,
            images: prevState.images.filter((image, idx) => idx !== index)
        }));
    };

    const handleCollectionChange = (event) => {
        setEditedNote(prevState => ({
            ...prevState,
            collection: event.target.value
        }));
    };

    const handleRemoveCollection = () => {
        setEditedNote(prevState => ({
            ...prevState,
            collection: ''
        }));
    };

    const handleShareNote = async () => {
        try {
            setShareError('');
            await axios.post('/notes/share', { noteId: note._id, friendId: selectedFriend });
            setShowShare(false);
            setSelectedFriend('');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setShareError(error.response.data.error);
            } else {
                console.error('Error sharing note:', error);
            }
        }
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
                            + Add Item
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
                    {editedNote.collection ? (
                        <div>
                            <span>Collection: {collections.find(col => col._id === editedNote.collection)?.name}</span>
                            <button onClick={handleRemoveCollection} className="note-button">Remove from Collection</button>
                        </div>
                    ) : (
                        <select value={editedNote.collection} onChange={handleCollectionChange} className="form-input">
                            <option value="">Select Collection</option>
                            {collections.map(collection => (
                                <option key={collection._id} value={collection._id}>{collection.name}</option>
                            ))}
                        </select>
                    )}
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
                        <img key={index} src={url} alt="Note" className="note-image" />
                    ))}
                    {canShare && (
                        <button onClick={() => setShowShare(!showShare)} className="note-button">
                            <FontAwesomeIcon icon={faShareAlt} /> Share
                        </button>
                    )}
                    {showShare && (
                        <div className="share-note-container">
                            <select
                                value={selectedFriend}
                                onChange={(e) => setSelectedFriend(e.target.value)}
                                className="user-select"
                            >
                                <option value="">Select a friend</option>
                                {friends.map(friend => (
                                    <option key={friend._id} value={friend._id}>{friend.username}</option>
                                ))}
                            </select>
                            <button onClick={handleShareNote} className="share-button">Share</button>
                            {shareError && <p className="error">{shareError}</p>}
                        </div>
                    )}
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
