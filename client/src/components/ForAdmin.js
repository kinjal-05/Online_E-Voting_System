import React, { useEffect, useState } from "react";
import axios from "axios"; 
import { useNavigate } from "react-router-dom";
import './ForAdmin.css';

const ForAdmin = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/election/election-results"); 
        setResults(response.data);
      } catch (err) {
        setError("Error fetching election results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) return <div className="loading-container"><p>Loading results...</p></div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-results-container">
      <h1 className="admin-results-title">Election Results</h1>
      {results.length > 0 ? (
        <div className="results-list">
          {results.map((result) => (
            <div key={result._id} className="result-card">
              <h3 className="candidate-name">{result.candidateName} <span className="party-name">({result.party})</span></h3>
              <p className="votes-count">Votes: {result.votes}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-results">No results available.</p>
      )}
      <button className="back-button" onClick={() => navigate("/admin-panel")}>Back to Dashboard</button>
    </div>
  );
};

export default ForAdmin;
