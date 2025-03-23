import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import './VoterDashboard.css'; 

const VoterDashboard = () => {
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const [isVoter, setIsVoter] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (currentUser) {
      setUser(currentUser);
      checkVoterStatus(currentUser._id);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const checkVoterStatus = async (userId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `https://online-e-voting-system.onrender.com/api/voters/votes/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data) {
        setIsVoter(true);
      }
    } catch (err) {
      setIsVoter(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterAsVoter = () => {
    navigate("/register-voter");
  };

  const handleUpdateProfile = () => {
    navigate("/update-profile");
  };

  const handleViewProfile = () => {
    navigate("/profile");
  };

  const handleGoToElection = () => {
    navigate("/election");
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("role");
    navigate("/dashboard");
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");

    if (confirmDelete) {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`https://online-e-voting-system.onrender.com/api/users/voters/delete/${user._id}`);

        alert("Your account has been deleted.");
        logout();
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        navigate("/dashboard");
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account. Please try again.");
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="voter-dashboard-container">
      <h2 className="voter-dashboard-title">Voter Dashboard</h2>
      <div className="voter-dashboard-info">
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
        {user && (
          <div className="user-info">
            {isVoter ? (
              <div>
                <p className="welcome-message">Welcome, {user.name}! You are registered as a voter.</p>
                <div className="voter-actions">
                  <button className="action-btn" onClick={handleViewProfile}>View Profile</button>
                  <button className="action-btn" onClick={handleUpdateProfile}>Update Profile</button>
                  <button className="action-btn" onClick={handleGoToElection}>Go to Election</button>
                </div>
              </div>
            ) : (
              <div>
                <p className="not-registered">You are not registered as a voter.</p>
                <button className="register-btn" onClick={handleRegisterAsVoter}>Register as Voter</button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="dashboard-actions">
        <button className="view-results-btn" onClick={() => navigate("/view-resultsvoter")}>View Results</button>
        <button className="delete-account-btn" onClick={handleDeleteAccount}>Delete Account</button>
      </div>
    </div>
  );
};

export default VoterDashboard;
