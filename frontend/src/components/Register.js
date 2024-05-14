import React, { useState } from 'react';
import axios from '../axiosConfig'; 
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Register.css';  // Asegúrate de que la ruta al archivo CSS es correcta

function Register() {
    const [userDetails, setUserDetails] = useState({
        username: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleChange = (event) => {
        setUserDetails({ ...userDetails, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/users/register', userDetails);
            console.log('Registration successful:', response.data);
            navigate('/login'); // Redireccionar a la página de inicio de sesión
        } catch (error) {
            console.error('Registration error:', error.response ? error.response.data : 'No response');
            alert('Registration failed');
        }
    };

    return (
        <div className="register-body">
            <form className="register-form" onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                    id="username"
                    type="text"
                    name="username"
                    value={userDetails.username}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="email">Email:</label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    value={userDetails.email}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="password">Password:</label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    value={userDetails.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Register</button>
                <p>Do you already have an account? <Link to="/login">Log in here</Link></p>
            </form>
        </div>
    );
}

export default Register;
