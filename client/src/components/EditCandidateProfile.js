import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import './EditCandidateProfile.css'; 

const EditCandidateProfile = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [candidateInfo, setCandidateInfo] = useState({
    firstName: "",
    lastName: "",
    party: "",
    district: "",
    state: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { userId } = location.state || {};

  useEffect(() => {
    if (!userId) {
      setError("User not found");
      setLoading(false);
      return;
    }

    const fetchCandidateInfo = async () => {
      try {
        const response = await axios.get(`https://voteguard-backend.onrender.com/api/candidates/candidates/${userId}`);
        if (response.data) {
          setCandidateInfo(response.data);
        }
      } catch (err) {
        setError("Error fetching candidate information");
        console.error("Error fetching candidate info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidateInfo();
  }, [userId]);

  const handleChange = (e) => {
    setCandidateInfo({
      ...candidateInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`https://voteguard-backend.onrender.com/api/candidates/candidates/${userId}`, candidateInfo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/candidate-panel");
    } catch (err) {
      setError("Error updating candidate profile");
      console.error("Error updating profile:", err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="edit-profile-container">
      <h2>Edit Candidate Profile</h2>
      {error && <p className="error-message">{error}</p>}

      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            value={candidateInfo.firstName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Last Name:
          <input
            type="text"
            name="lastName"
            value={candidateInfo.lastName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Party:
          <input
            type="text"
            name="party"
            value={candidateInfo.party}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          District:
          <input
            type="text"
            name="district"
            value={candidateInfo.district}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          State:
          <input
            type="text"
            name="state"
            value={candidateInfo.state}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" className="submit-btn">Update Profile</button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate("/candidate-panel")}>
            Cancel
          </button>
      </form>
    </div>
  );
};

export default EditCandidateProfile;
