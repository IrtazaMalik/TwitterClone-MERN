import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile({ match }) {
    const [user, setUser] = useState(null);
    const [bio, setBio] = useState('');
    const [coverPhoto, setCoverPhoto] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`/api/users/${match.params.username}`);
            setUser(res.data);
            setBio(res.data.bio);
            setCoverPhoto(res.data.coverPhoto);
        };
        fetchUser();
    }, [match.params.username]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('/api/users/profile', { username: user.username, bio, coverPhoto });
        // Optionally, refresh user data
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="profile-page">
            <div className="cover-photo" style={{ backgroundImage: `url(${coverPhoto})` }}></div>
            <h1>{user.username}</h1>
            <form onSubmit={handleSubmit}>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio"></textarea>
                <input type="text" value={coverPhoto} onChange={(e) => setCoverPhoto(e.target.value)} placeholder="Cover Photo URL" />
                <button type="submit">Save Profile</button>
            </form>
        </div>
    );
}

export default Profile;
