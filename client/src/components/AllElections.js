import React, { useState, useEffect } from "react";
import axios from "axios"; 
import { useNavigate } from "react-router-dom"; 
import './AllElections.css'; 

const AllElections = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchElections = async () => {
    setLoading(true);
    setError(""); 
    try {
      const response = await axios.get("http://localhost:5000/api/elections/elections");
      setElections(response.data); 
    } catch (err) {
      setError("Error fetching elections");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateElection = (electionId) => {
    navigate(`/update-election/${electionId}`);
  };

  const handleDeleteElection = async (electionId) => {
    if (window.confirm("Are you sure you want to delete this election?")) {
      try {
        await axios.delete(`http://localhost:5000/api/elections/elections/${electionId}`);
        fetchElections(); 
      } catch (err) {
        setError("Error deleting election");
      }
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  return (
    <div className="all-elections-container">
      <h1>All Elections</h1>
      <button className="back-btn" onClick={() => navigate("/admin-panel")}>
        Go to Admin Panel
      </button>
      {loading && <p className="loading-text">Loading elections...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="table-container">
        <table className="election-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Districts</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {elections.map((election) => (
              <tr key={election._id}>
                <td>{election.name}</td>
                <td>{new Date(election.startDate).toLocaleDateString()}</td>
                <td>{new Date(election.endDate).toLocaleDateString()}</td>
                <td>{election.status}</td>
                <td>{election.districts.join(", ")}</td>
                <td>
                  <button
                    className="update-btn"
                    onClick={() => handleUpdateElection(election._id)}
                  >
                    Update
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteElection(election._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllElections;
