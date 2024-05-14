const jwt = require('jsonwebtoken');

exports.requireRole = (requiredRole) => {
    return (req, res, next) => {
        if (!req.headers.authorization) {
            return res.status(401).json({ message: "No authorization token provided" });
        }

        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Authorization token is not properly formatted" });
        }

        try {
            const decoded = jwt.verify(token, 'your_jwt_secret');
            if (decoded.role === requiredRole) {
                next();
            } else {
                res.status(403).json({ message: "Access denied" });
            }
        } catch (error) {
            res.status(401).json({ message: "Invalid token", error: error.message });
        }
    };
};
