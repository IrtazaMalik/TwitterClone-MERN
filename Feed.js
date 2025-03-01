import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Feed.css';

const Feed = () => {
    const [tweets, setTweets] = useState([]);
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);
    const [userProfile, setUserProfile] = useState({ name: '', bio: '', profilePic: '' });
    const [userName, setUserName] = useState('YourName'); // Default name
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/signin');
            return;
        }

        const fetchUserProfile = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/users/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserProfile({
                    name: res.data.name,
                    bio: res.data.bio,
                    profilePic: res.data.profilePic
                });
                setUserName(res.data.name);
            } catch (err) {
                setError('Error loading profile. Please try again later.');
            }
        };
        fetchUserProfile();
    }, [token, navigate]);

    useEffect(() => {
        const fetchTweets = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/tweets');
                setTweets(res.data); // Load tweets from server
            } catch (err) {
                console.error('Error fetching tweets:', err);
                setError('An error occurred while fetching tweets. Please try again later.');
            }
        };
        fetchTweets();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            navigate('/signin');
            return;
        }

        const formData = new FormData();
        formData.append('content', content);
        formData.append('userId', '66b4a84d13926d56daaf0ef1'); // Replace this with dynamic user ID if necessary
        if (image) formData.append('image', image);

        try {
            const res = await axios.post('http://localhost:5000/api/tweets', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            setTweets([{ 
                _id: res.data._id, 
                content: res.data.content, 
                imageUrl: res.data.imageUrl, 
                user: { name: userName }, 
                likes: 0 
            }, ...tweets]);

            setContent('');
            setImage(null); // Reset the image input after posting
        } catch (err) {
            console.error('Error posting tweet:', err);
            setError('An error occurred while posting the tweet. Please try again later.');
        }
    };

    const handleLike = async (tweetId) => {
        try {
            await axios.post(`http://localhost:5000/api/tweets/${tweetId}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setTweets(tweets.map(tweet =>
                tweet._id === tweetId
                    ? { ...tweet, likes: tweet.likes + 1 }
                    : tweet
            ));
        } catch (err) {
            console.error('Error liking tweet:', err);
        }
    };

    const handleDelete = async (tweetId) => {
        try {
            await axios.delete(`http://localhost:5000/api/tweets/${tweetId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setTweets(tweets.filter(tweet => tweet._id !== tweetId));
        } catch (err) {
            console.error('Error deleting tweet:', err);
            setError('An error occurred while deleting the tweet. Please try again later.');
        }
    };

    return (
        <div className="feed-container">
            <div className="header">
            <h2 className="feed-title">Feed</h2>
            <Link to="/edit-profile" className="edit-profile-link">
                    <h3>Profile</h3>
                    <div className="profile-details">
                        <p>Name: {userProfile.name}</p>
                        <p>Bio: {userProfile.bio}</p>
                    </div>
                </Link>
            </div>
    
            {error && <div className="error-message">{error}</div>}
    
            <div className="tweet-form-container">
                <form className="tweet-form" onSubmit={handleSubmit}>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What's happening?"
                        required
                    ></textarea>
                    <input 
                        type="file" 
                        onChange={(e) => setImage(e.target.files[0])} 
                        accept="image/*"
                    />
                    <button type="submit">Tweet</button>
                </form>
            </div>
    
            <div className="tweets-container">
                {tweets.length === 0 ? (
                    <p>No tweets to show</p>
                ) : (
                    tweets.map((tweet) => (
                        <div key={tweet._id} className="post">
                            <p>{tweet.content}</p>
                            {tweet.imageUrl && <img src={`http://localhost:5000${tweet.imageUrl}`} alt="tweet" className="tweet-image" />}
                            <p>Posted by: {tweet.user.name}</p>
                            <div className="post-actions">
                                <button className="like-button" onClick={() => handleLike(tweet._id)}>
                                    Like {tweet.likes || 0}
                                </button>
                                <button className="delete-button" onClick={() => handleDelete(tweet._id)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};    

export default Feed;
