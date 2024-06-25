import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import '../styles/Friends.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const Friends = () => {
    const [friendRequests, setFriendRequests] = useState([]);
    const [friends, setFriends] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const navigate = useNavigate();
    const [showRequests, setShowRequests] = useState(true);
    const [showFriends, setShowFriends] = useState(true);
    const [showAddFriend, setShowAddFriend] = useState(true);

    useEffect(() => {
        fetchFriendRequests();
        fetchFriends();
        fetchUsers();
    }, []);

    const fetchFriendRequests = async () => {
        try {
            const response = await axios.get('/friends/requests');
            setFriendRequests(response.data);
        } catch (error) {
            console.error('Error fetching friend requests:', error);
        }
    };

    const fetchFriends = async () => {
        try {
            const response = await axios.get('/friends');
            setFriends(response.data);
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/friends/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleSendRequest = async () => {
        if (selectedUser) {
            try {
                await axios.post('/friends/requests', { userId: selectedUser });
                setSelectedUser('');
            } catch (error) {
                console.error('Error sending friend request:', error);
            }
        }
    };

    const handleAcceptRequest = async (id) => {
        try {
            await axios.post(`/friends/requests/${id}/accept`);
            fetchFriendRequests();
            fetchFriends();
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    const handleRejectRequest = async (id) => {
        try {
            await axios.post(`/friends/requests/${id}/reject`);
            fetchFriendRequests();
        } catch (error) {
            console.error('Error rejecting friend request:', error);
        }
    };

    return (
        <div>
            <div className="note-management-links">
                <button onClick={() => navigate('/notes')} className="user-management-button">
                    <FontAwesomeIcon icon={faArrowLeft} /> Back to Notes
                </button>
            </div>
            <div className="friends-container">
                <div className="visibility-toggles">
                    <label>
                        <input
                            type="checkbox"
                            checked={showRequests}
                            onChange={() => setShowRequests(!showRequests)}
                        />
                        Show Friend Requests
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={showFriends}
                            onChange={() => setShowFriends(!showFriends)}
                        />
                        Show Friends
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={showAddFriend}
                            onChange={() => setShowAddFriend(!showAddFriend)}
                        />
                        Show Add Friend
                    </label>
                </div>

                {showRequests && (
                    <>
                        <h2>Friend Requests</h2>
                        <ul className="friend-requests-list">
                            {friendRequests.map(request => (
                                <li key={request._id} className="friend-request-item">
                                    <span>{request.sender.username}</span>
                                    <button onClick={() => handleAcceptRequest(request._id)}>Accept</button>
                                    <button onClick={() => handleRejectRequest(request._id)}>Reject</button>
                                </li>
                            ))}
                        </ul>
                    </>
                )}

                {showFriends && (
                    <>
                        <h2>Friends</h2>
                        <ul className="friends-list">
                            {friends.map(friend => (
                                <li key={friend._id} className="friend-item">
                                    {friend.username}
                                </li>
                            ))}
                        </ul>
                    </>
                )}

                {showAddFriend && (
                    <>
                        <h2>Add Friend</h2>
                        <div className="add-friend-form">
                            <select
                                value={selectedUser}
                                onChange={(e) => setSelectedUser(e.target.value)}
                                className="user-select"
                            >
                                <option value="">Select a user</option>
                                {users.map(user => (
                                    <option key={user._id} value={user._id}>{user.username}</option>
                                ))}
                            </select>
                            <button onClick={handleSendRequest} className="send-request-button">Send Friend Request</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Friends;