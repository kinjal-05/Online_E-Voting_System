import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import './UpdateElection.css'; 

const UpdateElection = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState({
    name: "",
    startDate: "",
    endDate: "",
    status: "upcoming",
    districts: [""],
    resultsDeclared: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [results, setResults] = useState(null);

  useEffect(() => {
    const fetchElection = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://voteguard-backend.onrender.com/api/elections/elections/${electionId}`);
        const { name, startDate, endDate, status, districts, resultsDeclared } = response.data;
        setElection({
          name,
          startDate: new Date(startDate).toISOString().split("T")[0],
          endDate: new Date(endDate).toISOString().split("T")[0],
          status,
          districts: districts.length > 0 ? districts : [""],
          resultsDeclared: resultsDeclared || false,
        });
      } catch (err) {
        setError("Error fetching election details");
      } finally {
        setLoading(false);
      }
    };
    fetchElection();
  }, [electionId]);

  const fetchElectionResults = async (id) => {
    try {
      const response = await axios.get(`https://voteguard-backend.onrender.com/api/votes/votes/results/${id}`);
      setResults(response.data.voteResults);
    } catch (err) {
      setError("Error fetching election results");
    }
  };

  const handleChange = (e) => {
    setElection({ ...election, [e.target.name]: e.target.value });
  };

  const handleResultDeclareChange = (e) => {
    setElection({ ...election, resultDeclared: e.target.checked });
  };

  const handleDistrictChange = (e, index) => {
    const newDistricts = [...election.districts];
    newDistricts[index] = e.target.value;
    setElection({ ...election, districts: newDistricts });
  };

  const handleAddDistrict = () => {
    setElection({ ...election, districts: [...election.districts, ""] });
  };

  const handleRemoveDistrict = (index) => {
    const newDistricts = election.districts.filter((_, i) => i !== index);
    setElection({ ...election, districts: newDistricts.length ? newDistricts : [""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.put(`https://voteguard-backend.onrender.com/api/elections/elections/${electionId}`, {
        ...election,
        districts: election.districts.filter((d) => d.trim() !== ""),
      });

      setSuccess("Election updated successfully!");
      setTimeout(() => navigate("/all-elections"), 2000);
    } catch (err) {
      setError("Error updating election");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-election-container">
      <h1>Update Election</h1>
      {loading && <p className="loading-text">Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <form onSubmit={handleSubmit} className="election-form">
        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="name" value={election.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Start Date:</label>
          <input type="date" name="startDate" value={election.startDate} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>End Date:</label>
          <input type="date" name="endDate" value={election.endDate} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Status:</label>
          <select name="status" value={election.status} onChange={handleChange} required>
            <option value="upcoming">Upcoming</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="form-group">
          <label>Districts</label>
          {election.districts.map((district, index) => (
            <div key={index} className="district-input">
              <input
                type="text"
                value={district}
                onChange={(e) => handleDistrictChange(e, index)}
                placeholder={`District ${index + 1}`}
                required
              />
              <button type="button" className="remove-btn" onClick={() => handleRemoveDistrict(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="add-district-btn" onClick={handleAddDistrict}>Add District</button>
        </div>

        {election.status === "completed" && (
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={election.resultDeclared}
                onChange={handleResultDeclareChange}
              />
              Declare Results
            </label>
          </div>
        )}

        <button type="submit" className="submit-btn">Update Election</button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate("/all-elections")}>
            Cancel
          </button>
      </form>

      {results && (
        <div className="results-section">
          <h2>Election Results</h2>
          <ul>
            {Object.entries(results).map(([candidateId, votes]) => (
              <li key={candidateId}>
                Candidate {candidateId}: {votes} votes
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UpdateElection;
