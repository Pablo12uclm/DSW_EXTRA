import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import Note from './Note';
import '../styles/SharedNotes.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const SharedNotes = () => {
    const [sharedNotes, setSharedNotes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSharedNotes();
    }, []);

    const fetchSharedNotes = async () => {
        try {
            const response = await axios.get('/notes/shared');
            setSharedNotes(response.data);
        } catch (error) {
            console.error('Error fetching shared notes:', error);
        }
    };

    return (
        <div>
            <div className="note-management-links">
                <button onClick={() => navigate('/notes')} className="user-management-button">
                    <FontAwesomeIcon icon={faArrowLeft} /> Back to Notes
                </button>
            </div>
            <div className="shared-notes-container">
                <h1>Shared Notes</h1>
                {sharedNotes.length > 0 ? (
                    sharedNotes.map(sharedNote => (
                        <Note
                            key={sharedNote.note._id}
                            note={sharedNote.note}
                            deleteNote={() => {}}
                            updateNote={() => {}}
                            canShare={false} // No permitir compartir nuevamente desde las notas compartidas
                        />
                    ))
                ) : (
                    <p>No shared notes available.</p>
                )}
            </div>
        </div>
    );
};

export default SharedNotes;
