import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Feed from './components/Feed';
import EditProfile from './components/EditProfile'; // Import the EditProfile component
import './App.css'; // Import the CSS file

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={
                    <div className="home-page">
                        <div className="welcome-message">
                            Welcome to the Twitter Clone
                        </div>
                        <div className="button-container">
                            <Link to="/signup" className="btn">Sign Up</Link>
                            <Link to="/signin" className="btn">Sign In</Link>
                        </div>
                    </div>
                } />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/feed" element={<Feed />} />
                <Route path="/edit-profile" element={<EditProfile />} /> {/* Add this route */}
            </Routes>
        </Router>
    );
}

export default App;
