import React, { useState } from 'react';
import axios from '../axiosConfig'; 
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Login.css';  // Asegúrate de que la ruta al archivo CSS es correcta

function Login() {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleChange = (event) => {
        setCredentials({ ...credentials, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/login', credentials);
            console.log('Login successful:', response.data);

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.user.role);

            navigate('/notes');
        } catch (error) {
            console.error('Login error:', error.response ? error.response.data : 'No response');
            alert('Login failed');
        }
    };
    

    return (
        <div className="login-body">
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                    id="username"
                    type="text"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="password">Password:</label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Login</button>
                <p>You do not have an account? <Link to="/register">Register here</Link></p>
            </form>
        </div>
    );
}

export default Login;
