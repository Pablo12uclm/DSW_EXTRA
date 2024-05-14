import axios from 'axios';

// Configurar la URL base de todas las llamadas AJAX a Axios
axios.defaults.baseURL = 'http://localhost:3000/api';

// Añadir un interceptor para incluir el token JWT en cada solicitud si está disponible
axios.interceptors.request.use(
    config => {
        // Obtener el token de localStorage
        const token = localStorage.getItem('token');
        // Si el token existe, añadirlo a los headers de la solicitud
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        // Devolver la promesa con el error si hay alguno
        return Promise.reject(error);
    }
);

// Manejar respuestas con error globalmente
axios.interceptors.response.use(
    response => response,  // Si no hay errores, simplemente devolver la respuesta
    error => {
        // Si la respuesta es un error 401, por ejemplo, podrías manejar aquí la lógica de redirección
        if (error.response && error.response.status === 401) {
            // Opcional: redirigir al usuario a la página de inicio de sesión
            // window.location.href = '/login';
            console.error('Unauthorized, redirecting...');
        }
        return Promise.reject(error);
    }
);

export default axios;