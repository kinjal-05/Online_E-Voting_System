import React, { useEffect, useState } from "react";
import axios from "axios"; 
import { useNavigate } from "react-router-dom";
import './ViewResults.css'; 

const ViewResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get("https://online-e-voting-system.onrender.com/api/election/election-results"); 
        setResults(response.data);
      } catch (err) {
        setError("Error fetching election results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) return <p className="loading">Loading results...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="results-container">
      <h1 className="results-title">Election Results</h1>
      {results.length > 0 ? (
        <div className="results-list">
          {results.map((result) => (
            <div key={result._id} className="result-item">
              <h3 className="candidate-name">{result.candidateName} ({result.party})</h3>
              <p className="vote-count">Votes: {result.votes}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-results">No results available.</p>
      )}
      <button className="back-btn" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
    </div>
  );
};

export default ViewResults;
