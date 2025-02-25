import React from "react";
import { useAuth } from "../context/AuthContext"; 
import { useNavigate } from "react-router-dom"; 
import './AdminDashboard.css'; 

const AdminDashboard = () => {
  const { logout } = useAuth(); 
  const navigate = useNavigate(); 

  
  const handleLogout = () => {
    logout(); 
    localStorage.removeItem("role"); 
    navigate("/dashboard"); 
  };

  const handleAddElection = () => {
    navigate("/add-election"); 
  };
  const handleShowAllElections = () => {
    navigate("/all-elections"); 
  };
  const handleManageCandidates = () => {
    navigate("/manage-candidates"); 
  };
  const handleManageVoters = () => {
    navigate("/manage-voters"); 
  };
  const handleDeclareResults = () => {
    navigate("/declare-results"); 
  };
  const handleManageSupportTeam = () => {
    navigate("/manage-support"); 
  };

  return (
    <div className="admin-dashboard-container">
      <div className="dashboard-header">
        <h1 className="admin-title">Admin Dashboard</h1>
        <p>Welcome to the Admin Dashboard!</p>
      </div>

    
      <div className="button-group">
        <h2>Manage Elections</h2>
        <button className="dashboard-button" onClick={handleAddElection}>Add Election</button>
        <button className="dashboard-button" onClick={handleShowAllElections}>Show All Elections</button>
      </div>

      
      <div className="button-group">
        <h2>Manage Users</h2>
        <button className="dashboard-button" onClick={handleManageCandidates}>Manage Candidates</button>
        <button className="dashboard-button" onClick={handleManageVoters}>Manage Voters</button>
        <button className="dashboard-button" onClick={handleManageSupportTeam}>Manage Support Team</button>
      </div>

      
      <div className="button-group">
        <h2>Election Results</h2>
        <button className="dashboard-button" onClick={handleDeclareResults}>Declare Results</button>
        <button className="dashboard-button" onClick={() => navigate("/view-resultsadmin")}>View Results</button>
      </div>

   
      <div className="logout-section">
        <button className="logout-button" onClick={handleLogout}>Logout</button>
        
      </div>
    </div>
  );
};

export default AdminDashboard;
