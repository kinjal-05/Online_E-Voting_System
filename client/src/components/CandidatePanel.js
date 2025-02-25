import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import './CandidatePanel.css'; 

const CandidatePanel = () => {
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const [candidateInfo, setCandidateInfo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (!user || !user._id) {
      setLoading(false);
      return;
    }

    const fetchCandidateInfo = async () => {
      try {
        const candidateResponse = await axios.get(
          `http://localhost:5000/api/candidates/candidates/${user._id}`
        );
        setCandidateInfo(candidateResponse.data);

        const postsResponse = await axios.get(
          `http://localhost:5000/api/posts/candidate/${user._id}`
        );
        setPosts(postsResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidateInfo();
  }, [user]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("role");
    navigate("/dashboard");
  };

  const handleEditProfile = () => {
    navigate("/edit-candidate-profile", { state: { userId: user._id } });
  };

  const handleViewProfile = () => {
    navigate("/view-candidate-profile", { state: { userId: user._id } });
  };

  const handlePostUpdate = () => {
    navigate("/candidate-posts");
  };

  const handleRegisterAsCandidate = () => {
    navigate("/register-candidate");
  };

  const handleShowAllPosts = () => {
    navigate("/candidate-events");
  };

  const handleShowAllElections = () => {
    navigate("/elections");
  };
  const handleDeleteAccount = async () => {
    if (!user) return;

    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");

    if (confirmDelete) {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`http://localhost:5000/api/users/voters/delete/${user._id}`);

        alert("Your account has been deleted.");
        logout();
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        navigate("/dashboard");
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account. Please try again.");
      }
    }
  };
  if (loading) return <div>Loading...</div>;

  return (
    <div className="candidate-panel">
      <h1>Welcome {user?.firstName} {user?.lastName}</h1>
      <div className="panel-buttons">
        {candidateInfo ? (
          <div className="candidate-info">
            <button className="primary-btn" onClick={handleViewProfile}>View Profile</button>
            <button className="primary-btn" onClick={handleEditProfile}>Edit Profile</button>
            <button className="primary-btn" onClick={handlePostUpdate}>Post Update</button>
            <button className="primary-btn" onClick={handleShowAllElections}>Show All Elections</button>
          </div>
        ) : (
          <div>
            <p>You are not registered as a candidate.</p>
            <button className="primary-btn" onClick={handleRegisterAsCandidate}>Register as Candidate</button>
          </div>
        )}
      </div>

      <div className="panel-buttons">
        <button className="secondary-btn" onClick={handleShowAllPosts}>Show All Posts</button>
      </div>

      
      <div className="posts-list">
        {posts.length > 0 ? (
          <ul>
            {posts.map((post) => (
              <li key={post._id} className="post-item">
                <h3>{post.title}</h3>
                <p>{post.description}</p>
                <p>{new Date(post.date).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No posts available.</p>
        )}
      </div>

      <div className="panel-buttons">
        <button className="secondary-btn" onClick={handleLogout}>Logout</button>
        <button className="secondary-btn" onClick={() => navigate("/view-resultscandidate")}>View Results</button>
        <button className="delete-account-btn" onClick={handleDeleteAccount}>Delete Account</button>
      </div>
    </div>
  );
};

export default CandidatePanel;
