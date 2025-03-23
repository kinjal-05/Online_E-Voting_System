import React, { useState } from "react";
import axios from "axios"; 
import { useNavigate } from "react-router-dom"; 
import './AddElection.css'; 
const AddElection = () => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("upcoming"); 
  const [districts, setDistricts] = useState([""]);
  const [resultsDeclared, setResultsDeclared] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); 

  const handleDistrictChange = (e, index) => {
    const newDistricts = [...districts];
    newDistricts[index] = e.target.value;
    setDistricts(newDistricts);
  };

  const handleAddDistrict = () => {
    setDistricts([...districts, ""]);
  };

  const handleRemoveDistrict = (index) => {
    const newDistricts = districts.filter((_, i) => i !== index);
    setDistricts(newDistricts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    setSuccess(""); 

    if (!name || !startDate || !endDate || districts.length === 0) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await axios.post("https://online-e-voting-system.onrender.com/api/elections/elections", {
        name,
        startDate,
        endDate,
        status,
        districts,
        resultsDeclared,
      });

      setSuccess("Election added successfully!");
      setName("");
      setStartDate("");
      setEndDate("");
      setDistricts([""]);
      setResultsDeclared(false);

      navigate("/admin-panel"); 
    } catch (err) {
      setError(err.response?.data?.message || "Error adding election");
    }
  };

  return (
    <div className="add-election-container">
      <h1>Add Election</h1>
      <form onSubmit={handleSubmit} className="election-form">
        <div className="form-group">
          <label htmlFor="name">Election Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Election Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            className="form-input"
          >
            <option value="upcoming">Upcoming</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="form-group">
          <label>Districts</label>
          {districts.map((district, index) => (
            <div key={index} className="district-input">
              <input
                type="text"
                value={district}
                onChange={(e) => handleDistrictChange(e, index)}
                placeholder={`District ${index + 1}`}
                required
                className="form-input"
              />
              <button
                type="button"
                onClick={() => handleRemoveDistrict(index)}
                className="remove-button"
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddDistrict} className="add-button">
            Add District
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="resultsDeclared">Results Declared</label>
          <input
            type="checkbox"
            id="resultsDeclared"
            checked={resultsDeclared}
            onChange={() => setResultsDeclared(!resultsDeclared)}
          />
        </div>

        <button type="submit" className="submit-button">Add Election</button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate("/admin-panel")}>
            Cancel
          </button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
};

export default AddElection;
