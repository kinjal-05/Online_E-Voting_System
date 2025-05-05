// import React from "react";
// import { useAuth } from "../context/AuthContext"; 
// import { useNavigate } from "react-router-dom"; 
// import './AdminDashboard.css'; 

// const AdminDashboard = () => {
//   const { logout } = useAuth(); 
//   const navigate = useNavigate(); 

  
//   const handleLogout = () => {
//     logout(); 
//     localStorage.removeItem("role"); 
//     navigate("/dashboard"); 
//   };

//   const handleAddElection = () => {
//     navigate("/add-election"); 
//   };
//   const handleShowAllElections = () => {
//     navigate("/all-elections"); 
//   };
//   const handleManageCandidates = () => {
//     navigate("/manage-candidates"); 
//   };
//   const handleManageVoters = () => {
//     navigate("/manage-voters"); 
//   };
//   const handleDeclareResults = () => {
//     navigate("/declare-results"); 
//   };
//   const handleManageSupportTeam = () => {
//     navigate("/manage-support"); 
//   };

//   return (
//     <div className="admin-dashboard-container">
//       <div className="dashboard-header">
//         <h1 className="admin-title">Admin Dashboard</h1>
//         <p>Welcome to the Admin Dashboard!</p>
//       </div>

    
//       <div className="button-group">
//         <h2>Manage Elections</h2>
//         <button className="dashboard-button" onClick={handleAddElection}>Add Election</button>
//         <button className="dashboard-button" onClick={handleShowAllElections}>Show All Elections</button>
//       </div>

      
//       <div className="button-group">
//         <h2>Manage Users</h2>
//         <button className="dashboard-button" onClick={handleManageCandidates}>Manage Candidates</button>
//         <button className="dashboard-button" onClick={handleManageVoters}>Manage Voters</button>
    
//       </div>

      
//       <div className="button-group">
//         <h2>Election Results</h2>
//         <button className="dashboard-button" onClick={handleDeclareResults}>Declare Results</button>
//         <button className="dashboard-button" onClick={() => navigate("/view-resultsadmin")}>View Results</button>
//       </div>

   
//       <div className="logout-section">
//         <button className="logout-button" onClick={handleLogout}>Logout</button>
        
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;







import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // State for managing active tab
  const [activeTab, setActiveTab] = useState("elections");

  // Logout function
  const handleLogout = () => {
    logout();
    localStorage.removeItem("role");
    navigate("/dashboard");
  };

  // Navigation function
  const handleNavigate = (path) => {
    navigate(path);
    setActiveTab(path); // Set the active tab for dynamic content
  };

  return (
    <div className="admin-dashboard-container">
      {/* Header with navigation buttons */}
      <div className="header">
        <div className="nav-buttons">
          <button
            className={`nav-button ${activeTab === "elections" ? "active" : ""}`}
            onClick={() => handleNavigate("/add-election")}
          >
            <i className="fas fa-plus-circle"></i> Add Election
          </button>
          <button
            className={`nav-button ${activeTab === "showElections" ? "active" : ""}`}
            onClick={() => handleNavigate("/all-elections")}
          >
            <i className="fas fa-list-alt"></i> Show All Elections
          </button>
          <button
            className={`nav-button ${activeTab === "manageCandidates" ? "active" : ""}`}
            onClick={() => handleNavigate("/manage-candidates")}
          >
            <i className="fas fa-users-cog"></i> Manage Candidates
          </button>
          <button
            className={`nav-button ${activeTab === "manageVoters" ? "active" : ""}`}
            onClick={() => handleNavigate("/manage-voters")}
          >
            <i className="fas fa-users"></i> Manage Voters
          </button>
          <button
            className={`nav-button ${activeTab === "declareResults" ? "active" : ""}`}
            onClick={() => handleNavigate("/declare-results")}
          >
            <i className="fas fa-trophy"></i> Declare Results
          </button>
          <button
            className={`nav-button ${activeTab === "viewResults" ? "active" : ""}`}
            onClick={() => handleNavigate("/view-resultsadmin")}
          >
            <i className="fas fa-eye"></i> View Results
          </button>
          
          
          <button className="nav-button logout" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <div className="welcome-message">
          <h1 className="admin-title">Admin Dashboard</h1>
          <h2>Welcome to the Admin Dashboard!</h2>
          {/* Display content based on the active tab */}
          <div className="content">
            {activeTab === "showElections" && <p>Show all elections.</p>}
            {activeTab === "manageCandidates" && <p>Manage the candidates.</p>}
            {activeTab === "manageVoters" && <p>Manage the voters.</p>}
            {activeTab === "declareResults" && <p>Declare the election results.</p>}
            {activeTab === "viewResults" && <p>View the election results.</p>}
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
