import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ForAdmin.css";

const ForAdmin = () => {
  const [groupedResults, setGroupedResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get("https://online-e-voting-system.onrender.com/api/election/election-results");
        const electionResults = response.data;

        if (!electionResults || electionResults.length === 0) {
          setLoading(false);
          return;
        }

        // Group results by election name
        const groupedData = electionResults.reduce((acc, result) => {
          const electionName = result.name || "Unknown Election"; // Ensure name is always available
          if (!acc[electionName]) {
            acc[electionName] = [];
          }
          acc[electionName].push(result);
          return acc;
        }, {});

        // Sort each election's candidates by votes in descending order (highest first)
        Object.keys(groupedData).forEach((election) => {
          groupedData[election].sort((a, b) => b.votes - a.votes);
        });

        setGroupedResults(groupedData);
      } catch (err) {
        setError("Error fetching election results. Please try again later.");
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

      {Object.keys(groupedResults).length > 0 ? (
        <div className="election-results-grid">
          {Object.keys(groupedResults).map((electionName) => (
            <div key={electionName} className="election-card">
              <h2 className="election-name">{electionName}</h2>
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Party</th>
                    <th>Votes</th>
                    <th>Winner</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedResults[electionName].map((result, index) => (
                    <tr key={result._id} className={index === 0 ? "winner-row" : ""}>
                      <td>{result.candidateName}</td>
                      <td>{result.party}</td>
                      <td>{result.votes}</td>
                      <td>{index === 0 ? "🏆 Winner" : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-results">No results available.</p>
      )}

      <button className="back-button" onClick={() => navigate("/candidate-panel")}>Back to Dashboard</button>
    </div>
  );
};

export default ForAdmin;
