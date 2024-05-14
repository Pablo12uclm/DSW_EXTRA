const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            console.log("User not found:", username);
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const match = await bcrypt.compare(password, user.password);
        console.log("Password match:", match);

        if (!match) {
            console.log("Password incorrect for user:", username);
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token, user: { role: user.role } }); // Asegúrate de enviar el rol aquí
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
