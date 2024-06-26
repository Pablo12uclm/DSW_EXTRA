const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Asume formato "Bearer Token"
    if (!token) {
        return res.status(401).json({ message: "Authorization token is not provided or improperly formatted" });
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.user = decoded; // Agrega la información decodificada al objeto de solicitud
        console.log('Authenticated User ID:', req.user.id); // Log del ID del usuario autenticado
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token", error: error.message });
    }
};

module.exports = isAuthenticated;
