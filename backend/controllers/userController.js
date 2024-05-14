const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Registro de usuario
exports.register = async (req, res) => {
    try {
        const { username, email, password, role = 'User' } = req.body;
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Obtener información del usuario autenticado
exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching current user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Obtener todos los usuarios para administradores
exports.getUsers = async (req, res) => {
    try {
        if (req.user.role === "Admin") {
            const users = await User.find({ role: 'User' });
            res.status(200).json(users);
        } else {
            res.status(403).json({ message: 'Forbidden' });
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Actualizar usuario
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const update = req.body;
    const updatedUser = await User.findByIdAndUpdate(id, update, { new: true }).select("-password");
    if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(200).send('Usuario eliminado con éxito');
    } catch (error) {
        console.error('Error eliminando usuario:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


