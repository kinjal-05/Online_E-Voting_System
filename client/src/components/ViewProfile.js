import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './ViewProfile.css';

const ViewProfile = () => {
  const [user, setUser] = useState(null);
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
    const token = localStorage.getItem("token"); 
    try {
      const response = await axios.get(
        `http://localhost:5000/api/voters/votes/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` }, 
        }
      );
      setUser(response.data); 
    } catch (err) {
      console.error("Error fetching profile", err);
      alert("Error fetching profile data.");
    } finally {
      setLoading(false);
    }
  };

  
  const handleUpdateProfile = () => {
    navigate("/update-profile"); 
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h2 className="profile-title">Your Profile</h2>
      {user ? (
        <div className="profile-details">
          <p><strong>First Name:</strong> {user.firstName}</p>
          <p><strong>Last Name:</strong> {user.lastName}</p>
          <p><strong>Date of Birth:</strong> {user.dob}</p>
          <p><strong>District:</strong> {user.district}</p>
          <p><strong>State:</strong> {user.state}</p>
          <p><strong>Address:</strong> {user.profile?.address}</p>
          <p><strong>Phone Number:</strong> {user.profile?.phoneNumber}</p>
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/voter-dashboard")}>
            Back to Voter Dashboard
          </button>
        </div>
      ) : (
        <p>No profile found.</p>
      )}
    </div>
  );
};

export default ViewProfile;
