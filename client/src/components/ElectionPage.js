import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './ElectionPage.css'; 

const ElectionPage = () => {
  const [elections, setElections] = useState([]);
  const [user, setUser] = useState(null);
  const [district, setDistrict] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (!currentUser) {
      navigate("/login");
    } else {
      setUser(currentUser);
      fetchVoterDistrict(currentUser._id); 
    }
  }, [navigate]);

  
  const fetchVoterDistrict = async (userId) => {
    try {
      const response = await axios.get(`https://online-e-voting-system.onrender.com/api/voters/votes/${userId}`);
      if (response.data) {
        const voterData = response.data;
        setDistrict(voterData.district);
        fetchElections(voterData.district);
      }
    } catch (err) {
      console.error("Error fetching voter details:", err);
      alert("Failed to fetch voter details.");
      setLoading(false);
    }
  };

 
  const fetchElections = async (voterDistrict) => {
    try {
      const response = await axios.get("https://online-e-voting-system.onrender.com/api/elections/elections");
      
      const filteredElections = response.data.filter(
        (election) =>
          Array.isArray(election.districts) &&
          election.districts.includes(voterDistrict) &&
          election.status === "active" 
      );
      setElections(filteredElections);
    } catch (err) {
      console.error("Error fetching elections:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = (electionId) => {
 
    navigate(`/election-candidates/${electionId}`);
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div className="election-page-container">
      <h2 className="page-title">Election Page</h2>
      <h3 className="welcome-message">Welcome, {user.name}!</h3>
      <p className="district-info">You are in the district: <strong>{district}</strong></p>
      <div className="election-table-container">
        {elections.length > 0 ? (
          <div>
            <h3 className="active-elections-title">Active Elections</h3>
            <table className="election-table">
              <thead>
                <tr>
                  <th>Election Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {elections.map((election) => (
                  <tr key={election._id}>
                    <td>{election.name}</td>
                    <td>
                      <button className="vote-button" onClick={() => handleVote(election._id)}>
                        Vote
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No active elections available for your district.</p>
        )}
      </div>
      <button className="back-button" onClick={() => navigate("/voter-dashboard")}>Back to Voter Panel</button>
    </div>
  );
};

export default ElectionPage;
