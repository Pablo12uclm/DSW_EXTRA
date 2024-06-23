const FriendRequest = require('../models/FriendRequest');
const User = require('../models/User');

// Controlador para obtener todas las solicitudes de amistad
exports.getFriendRequests = async (req, res) => {
    try {
        const requests = await FriendRequest.find({ receiver: req.user.id, status: 0 }).populate('sender', 'username');
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching friend requests' });
    }
};

// Controlador para obtener todos los amigos
exports.getFriends = async (req, res) => {
    try {
        const friends = await FriendRequest.find({ 
            $or: [{ sender: req.user.id }, { receiver: req.user.id }], 
            status: 1 
        }).populate('sender receiver', 'username');
        const friendList = friends.map(request => {
            return request.sender._id.toString() === req.user.id ? request.receiver : request.sender;
        });
        res.json(friendList);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching friends' });
    }
};

// Controlador para obtener todos los usuarios (para el combo box)
exports.getAllUsers = async (req, res) => {
  try {
      const users = await User.find({}, 'username'); 
      res.json(users);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching users' });
  }
};

// Controlador para enviar una solicitud de amistad
exports.sendFriendRequest = async (req, res) => {
    try {
        const newRequest = new FriendRequest({
            sender: req.user.id,
            receiver: req.body.userId,
            status: 0
        });
        await newRequest.save();
        res.status(201).json(newRequest);
    } catch (error) {
        res.status(500).json({ error: 'Error sending friend request' });
    }
};

// Controlador para aceptar una solicitud de amistad
exports.acceptFriendRequest = async (req, res) => {
    try {
        await FriendRequest.findByIdAndUpdate(req.params.requestId, { status: 1 });
        res.status(200).json({ message: 'Friend request accepted' });
    } catch (error) {
        res.status(500).json({ error: 'Error accepting friend request' });
    }
};

// Controlador para rechazar una solicitud de amistad
exports.rejectFriendRequest = async (req, res) => {
    try {
        await FriendRequest.findByIdAndUpdate(req.params.requestId, { status: 2 });
        res.status(200).json({ message: 'Friend request rejected' });
    } catch (error) {
        res.status(500).json({ error: 'Error rejecting friend request' });
    }
};
