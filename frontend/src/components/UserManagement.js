import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import '../styles/UserManagement.css';

function UserManagement() {
    const [currentUser, setCurrentUser] = useState({});
    const [users, setUsers] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingCurrentUser, setIsEditingCurrentUser] = useState(false);
    const [editUser, setEditUser] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchCurrentUser();
        if (currentUser.role === 'Admin') {
            fetchUsers();
        }
    }, [currentUser.role]);

    const fetchCurrentUser = async () => {
        try {
            const response = await axios.get('/users/current');
            setCurrentUser(response.data);
            setEditUser(response.data);
        } catch (error) {
            console.error('Error fetching current user:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleEdit = (user) => {
        setIsEditing(true);
        setEditUser(user);
    };

    const handleEditCurrentUser = () => {
        setIsEditingCurrentUser(true);
        setEditUser(currentUser);
    };

    const handleSave = async () => {
        try {
            await axios.put(`/users/${editUser._id}`, editUser);
            setIsEditing(false);
            setIsEditingCurrentUser(false);
            fetchCurrentUser();
            if (currentUser.role === 'Admin') {
                fetchUsers();
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleChange = (e) => {
        setEditUser({ ...editUser, [e.target.name]: e.target.value });
    };

    const handleMakeAdmin = async (userId) => {
        try {
            const updatedUser = { role: 'Admin' };
            await axios.put(`/users/${userId}`, updatedUser);
            fetchUsers();
        } catch (error) {
            console.error('Error making user admin:', error);
        }
    };
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`/users/${userId}`);
            if (userId === currentUser._id) {
                // Si el usuario eliminado es el usuario actual, cerrar sesión o redirigir
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                // Actualizar la lista de usuarios después de eliminar un usuario
                fetchUsers();
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };
    

    return (
        <div className="user-management-container">
            <div className="note-management-links">
                <button onClick={() => navigate('/notes')} className="user-management-button">
                    <FontAwesomeIcon icon={faArrowLeft} /> Back to Notes
                </button>
                <button onClick={handleLogout} className="logout-button user-management-button">
                    Logout
                </button>
            </div>
            <h1 className="user-management-header">Your User</h1>
            <div className="user-section">
                {isEditingCurrentUser ? (
                    <form onSubmit={handleSave} className="user-form">
                        <input type="text" name="username" value={editUser.username} onChange={handleChange} required />
                        <input type="email" name="email" value={editUser.email} onChange={handleChange} required />
                        <button type="submit">Save</button>
                        <button onClick={() => setIsEditingCurrentUser(false)}>Cancel</button>
                    </form>
                ) : (
                    <div>
                        <p className="user-details">Username: {currentUser.username}</p>
                        <p className="user-details">Email: {currentUser.email}</p>
                        <button onClick={handleEditCurrentUser} className="edit-button user-management-button">Edit</button>
                        <button onClick={() => handleDeleteUser(currentUser._id)} className="user-management-delete-button">Delete</button>
                    </div>
                )}
            </div>
            {currentUser.role === 'Admin' && (
                <div>
                    <h2 className="user-management-header">All Users</h2>
                    {users.map(user => (
                        <div key={user._id} className="user-section">
                            <p className="user-details">{user.username} - {user.email}</p>
                            <button onClick={() => handleEdit(user)} className="edit-button user-management-button">Edit</button>
                            {user.role !== 'Admin' && (
                                <button onClick={() => handleMakeAdmin(user._id)} className="admin-button user-management-button">Make Admin</button>
                            )}
                            <button onClick={() => handleDeleteUser(user._id)} className="user-management-delete-button">Delete</button>
                        </div>
                    ))}
                    {isEditing && (
                        <form onSubmit={handleSave} className="user-form">
                            <input type="text" name="username" value={editUser.username} onChange={handleChange} required />
                            <input type="email" name="email" value={editUser.email} onChange={handleChange} required />
                            <button type="submit">Save</button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}

export default UserManagement;
