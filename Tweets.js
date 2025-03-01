import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Tweets() {
    const [tweets, setTweets] = useState([]);
    const [content, setContent] = useState('');

    useEffect(() => {
        const fetchTweets = async () => {
            const res = await axios.get('/api/tweets');
            setTweets(res.data);
        };
        fetchTweets();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = 'your-user-id'; // Replace with actual user ID
        await axios.post('/api/tweets', { content, userId });
        setContent('');
        // Optionally, refresh tweets
    };

    return (
        <div className="tweets-page">
            <form onSubmit={handleSubmit}>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="What's happening?"></textarea>
                <button type="submit">Tweet</button>
            </form>
            <div className="tweets-list">
                {tweets.map(tweet => (
                    <div key={tweet._id} className="tweet">
                        <h3>{tweet.user.username}</h3>
                        <p>{tweet.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Tweets;
