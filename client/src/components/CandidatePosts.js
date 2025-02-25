
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import CandidatePosts from "./CandidatePosts"; 
import './CandidatePosts.css'; 

const CandidatePanel = () => {
  const [user, setUser] = useState(null); 
  const [candidateInfo, setCandidateInfo] = useState(null);
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
        const response = await axios.get(`http://localhost:5000/api/candidates/candidates/${user._id}`);
        console.log("Backend Response:", response); 

        if (response.data) {
          console.log("Candidate data received:", response.data);
          setCandidateInfo(response.data);
        } else {
          setCandidateInfo(null);
        }
      } catch (err) {
        console.error("Error fetching candidate info:", err);
        if (err.response && err.response.status === 404) {
          setCandidateInfo(null);
        }
      }
    };

    fetchCandidateInfo();

  }, [user]); 

  const handleLogout = () => {
    localStorage.removeItem("user"); 
    navigate("/dashboard"); 
  };

  const handleEditProfile = () => {
    navigate("/edit-candidate-profile", { state: { userId: user._id } });
  };

  const handlePostUpdate = () => {
    navigate("/candidate-posts");
  };

  const handleRegisterAsCandidate = () => {
    navigate("/register-candidate");
  };
  
  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="candidate-panel-container">
      <h1 className="welcome-title">Welcome, {user?.firstName} {user?.lastName}</h1>

   
      <div className="profile-actions">
        <button className="btn edit-btn" onClick={handleEditProfile}>Edit Profile</button>
        <button className="btn post-btn" onClick={handlePostUpdate}>Post Update</button>
      </div>

    
      {!candidateInfo && (
        <div className="candidate-registration">
          <p>You are not registered as a candidate.</p>
          <button className="btn register-btn" onClick={handleRegisterAsCandidate}>Register as Candidate</button>
        </div>
      )}

    
      {candidateInfo && <CandidatePosts userId={user._id} />}

      <button className="btn logout-btn" onClick={handleLogout}>Logout</button>
     
    </div>
  );
};

export default CandidatePanel;
