import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './AdminVoterManagement.css'; 

const AdminVoterManagement = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [voters, setVoters] = useState([]);

  useEffect(() => {
    fetchVoters();
  }, []);

  const fetchVoters = async () => {
    try {
      const response = await axios.get("https://voteguard-backend.onrender.com/api/voters/voters"); 
      setVoters(response.data);
    } catch (error) {
      console.error("Error fetching voters:", error);
    }
  };

  const handleDeleteVoter = async (voterId) => {
    if (window.confirm("Are you sure you want to delete this voter?")) {
      try {
        await axios.delete(`https://voteguard-backend.onrender.com/api/voters/voters/${voterId}`); 
        setVoters(voters.filter((voter) => voter._id !== voterId));
      } catch (error) {
        console.error("Error deleting voter:", error);
      }
    }
  };

  return (
    <div className="admin-voter-management">
      <h1>Admin Voter Management</h1>
      <p className="welcome-text">Welcome to the Admin Voter Management Page!</p>

     
      <div className="voter-table-container">
        <h2>All Voters</h2>
        <table className="voter-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Date of Birth</th>
              <th>District</th>
              <th>State</th>
              <th>Address</th>
              <th>Phone Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {voters.map((voter) => (
              <tr key={voter._id}>
                <td>{voter.firstName}</td>
                <td>{voter.lastName}</td>
                <td>{voter.dob}</td>
                <td>{voter.district}</td>
                <td>{voter.state}</td>
                <td>{voter.profile.address}</td>
                <td>{voter.profile.phoneNumber}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDeleteVoter(voter._id)}>
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

export default AdminVoterManagement;
