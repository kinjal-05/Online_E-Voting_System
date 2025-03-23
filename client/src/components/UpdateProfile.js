import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './UpdateProfile.css'; 

const UpdateProfile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    district: "",
    state: "",
    profile: {
      address: "",
      phoneNumber: "",
    },
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (!currentUser) {
      navigate("/login"); 
    } else {
      setUser(currentUser);
      fetchUserProfile(currentUser._id); 
    }
  }, [navigate]);

  
  const fetchUserProfile = async (userId) => {
    try {
      const response = await axios.get(`https://online-e-voting-system.onrender.com/api/voters/votes/${userId}`);
      setFormData(response.data); 
      setUser((prevUser) => ({
        ...prevUser,
        _id: response.data._id,
      }));
    } catch (err) {
      console.error("Error fetching profile", err);
      alert("Error fetching your profile data.");
    } finally {
      setLoading(false);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name.includes("profile.") ? "profile" : name]: name.includes("profile.")
        ? { ...prevData.profile, [name.split(".")[1]]: value }
        : value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.put(
        `https://online-e-voting-system.onrender.com/api/voters/votes/${user._id}`,
        formData
      );
      alert("Profile updated successfully!");
      navigate("/voter-dashboard"); 
    } catch (err) {
      console.error("Error updating profile", err);
      alert("Error updating profile.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>; 
  }

  return (
    <div className="profile-container">
      <h2 className="profile-title">Update Profile</h2>
      {user && (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>District</label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="profile.address"
              value={formData.profile.address}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="profile.phoneNumber"
              value={formData.profile.phoneNumber}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-submit">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Updating..." : "Update Profile"}
            </button>
            
          </div>
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/voter-dashboard")}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default UpdateProfile;
