import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import './ElectionCandidatesPage.css'; 

const ElectionCandidatesPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { electionId } = useParams();
  const navigate = useNavigate();

 
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/elections/candidates/${electionId}`);
        setCandidates(response.data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
        alert("Failed to fetch candidates.");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [electionId]);

 
  const handleVote = async (candidateId) => {
    const currentUser = JSON.parse(localStorage.getItem("user")); 
    
    if (!currentUser || !currentUser._id) {
      alert("User not authenticated.");
      return;
    }
  
    const userId = currentUser._id; 
  
    try {
      
      const voterResponse = await axios.get(`http://localhost:5000/api/voters/votes/${userId}`);
      const voterData = voterResponse.data;
  
      if (!voterData || !voterData._id) {
        alert("Voter information not found.");
        return;
      }
  
      const voterId = voterData._id; 
  
   
      const response = await axios.post(
        `http://localhost:5000/api/elections/vote/${electionId}`,
        { candidateId, voterId, electionId } 
      );
  
      if (response.status === 200) {
        alert("Vote submitted successfully!");
      }
    } catch (err) {
      console.error("Error voting:", err);
      alert("There was an error voting. Please try again.");
    }
  };
  

  if (loading) {
    return <div className="loading-container">Loading candidates...</div>;
  }

  return (
    <div className="election-candidates-container">
      <h2 className="page-title">Candidates for Election</h2>
      <div className="candidates-list">
        {candidates.length > 0 ? (
          candidates.map((candidate) => (
            <div key={candidate._id} className="candidate-card">
              <h3 className="candidate-name">
                {candidate.firstName} {candidate.lastName}
              </h3>
              <p className="candidate-party">Party: {candidate.party}</p>
              <button className="vote-button" onClick={() => handleVote(candidate._id)}>
                Vote
              </button>
            </div>
          ))
        ) : (
          <p>No candidates available for this election.</p>
        )}
      </div>
      <button className="back-button" onClick={() => navigate("/voter-dashboard")}>Back to Elections</button>
    </div>
  );
};

export default ElectionCandidatesPage;
