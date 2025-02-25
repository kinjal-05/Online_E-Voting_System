import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './ManageCandidates.css'; 

const ManageCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const fetchCandidates = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("http://localhost:5000/api/candidates/candidates");
      setCandidates(response.data);
    } catch (err) {
      setError("Error fetching candidates");
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteCandidate = async (candidateId) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      try {
        await axios.delete(`http://localhost:5000/api/candidates/candidates/${candidateId}`);
        fetchCandidates(); 
      } catch (err) {
        setError("Error deleting candidate");
      }
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  return (
    <div className="manage-candidates-container">
      <h1>Manage Candidates</h1>
      {loading && <p className="loading-text">Loading candidates...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="table-container">
        <table className="candidates-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>District</th>
              <th>State</th>
              <th>Party</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate._id}>
                <td>{candidate.firstName}</td>
                <td>{candidate.lastName}</td>
                <td>{candidate.district}</td>
                <td>{candidate.state}</td>
                <td>{candidate.party}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDeleteCandidate(candidate._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="back-btn" onClick={() => navigate("/admin-panel")}>Back to Admin Panel</button>
    </div>
  );
};

export default ManageCandidates;
