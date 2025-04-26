import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ViewCandidateProfile.css"; 

const ViewCandidateProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!location.state || !location.state.userId) {
      navigate("/candidate-panel");
      return;
    }

    const fetchCandidateProfile = async () => {
      try {
        const response = await axios.get(
          `https://voteguard-backend.onrender.com/api/candidates/candidates/${location.state.userId}`
        );
        setCandidate(response.data);
      } catch (error) {
        console.error("Error fetching candidate profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidateProfile();
  }, [location, navigate]);

  if (loading) return <div>Loading...</div>;
  if (!candidate) return <div>Profile not found</div>;

  return (
    <div className="profile-container">
      <h2>Candidate Profile</h2>
      <div className="profile-details">
        <p><strong>FirstName:</strong> {candidate.firstName} </p>
        <p><strong>LastName:</strong> {candidate.lastName}</p>
        
        <p><strong>Party:</strong> {candidate.party}</p>
        <p><strong>State:</strong> {candidate.state}</p>
        <p><strong>District:</strong> {candidate.district}</p>
            
      </div>
      <button className="back-btn" onClick={() => navigate("/candidate-panel")}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default ViewCandidateProfile;
