import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ManageSupportTeam.css"; 

const ManageSupportTeam = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get("https://voteguard-backend.onrender.com/api/users/users/admins");
        setAdmins(response.data);
      } catch (err) {
        console.error("Error fetching admin users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="manage-support-container">
      <h1>Manage Support Team</h1>
      <button className="back-button" onClick={() => navigate("/admin-panel")}>
        Back to Dashboard
      </button>

      {admins.length > 0 ? (
        <table className="support-team-table">
          <thead>
            <tr>
              <th>Name</th>
              
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin._id}>
                
                <td>{admin.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No support team members found.</p>
      )}
    </div>
  );
};

export default ManageSupportTeam;
