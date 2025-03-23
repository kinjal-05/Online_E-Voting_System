import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './DeclareResults.css'; 

const DeclareResults = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await axios.get("https://online-e-voting-system.onrender.com/api/elections/elections");
        const completedElections = response.data.filter((election) => election.status === "completed");
        setElections(completedElections);
      } catch (err) {
        setError("Error fetching elections");
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

 
  const handleDeclareResults = async (electionId) => {
    try {
      
      const response = await axios.get(`https://online-e-voting-system.onrender.com/api/votes/votes/results/${electionId}`);
      const winners = response.data.winners;

    
      setElections((prevElections) =>
        prevElections.map((election) =>
          election._id === electionId ? { ...election, resultsDeclared: true, results: winners } : election
        )
      );

      alert("Results declared successfully!");
    } catch (error) {
      alert("Error declaring results. Please try again.");
    }
  };

  return (
    <div className="declare-results-container">
      <h1 className="page-title">Declared Election Results</h1>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error-message">{error}</div>}

      {elections.length > 0 ? (
        <div className="election-list">
          {elections.map((election) => (
            <div key={election._id} className="election-card">
              <h2 className="election-name">{election.name}</h2>
              <p className="election-date">
                <strong>Start Date:</strong> {new Date(election.startDate).toLocaleDateString()}
              </p>
              <p className="election-date">
                <strong>End Date:</strong> {new Date(election.endDate).toLocaleDateString()}
              </p>

            
              {!election.resultsDeclared ? (
                <button
                  className="declare-results-btn"
                  onClick={() => handleDeclareResults(election._id)}
                >
                  Declare Results
                </button>
              ) : (
                <p className="results-declared">Results Declared</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No completed elections available.</p>
      )}

      <button className="back-btn" onClick={() => navigate("/admin-panel")}>
        Back to Admin Panel
      </button>
    </div>
  );
};

export default DeclareResults;
