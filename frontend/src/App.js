import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import NotesList from './components/NotesList';
import UserManagement from './components/UserManagement';
import Collection from './components/Collection';
import Friends from './components/Friends';
import './styles/App.css';

function App() {
    const isLoggedIn = localStorage.getItem('token');

    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/notes" element={isLoggedIn ? <NotesList /> : <Navigate replace to="/login" />} />
                    <Route path="/manage-users" element={isLoggedIn ? <UserManagement /> : <Navigate replace to="/login" />} />
                    <Route path="/collection" element={isLoggedIn ? <Collection /> : <Navigate replace to="/login" />} />
                    <Route path="/friends" element={<Friends />} />

                    <Route path="/" element={<Navigate replace to={isLoggedIn ? "/notes" : "/login"} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
