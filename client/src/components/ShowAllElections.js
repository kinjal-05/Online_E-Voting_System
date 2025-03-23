import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './ShowAllElections.css';

const ShowAllElections = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      fetchCandidate(storedUser._id);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchCandidate = async (userId) => {
    try {
      const response = await axios.get(`https://online-e-voting-system.onrender.com/api/candidates/candidates/${userId}`);
      setCandidate(response.data);
    } catch (error) {
      console.error("Error fetching candidate data:", error);
    }
  };

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await axios.get("https://online-e-voting-system.onrender.com/api/elections/elections");
        const upcomingElections = response.data.filter(election => election.status === "upcoming");
        setElections(upcomingElections);
      } catch (error) {
        console.error("Error fetching elections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

  const handleRegisterForElection = async (electionId) => {
    if (!candidate) {
      alert("Candidate information not found. Please try again later.");
      return;
    }

    try {
      const response = await axios.post("https://online-e-voting-system.onrender.com/api/elections/elections/register", {
        electionId,
        candidateId: candidate._id,
      });
      alert(response.data.message);
    } catch (error) {
      console.error("Error registering for election:", error);
      alert("Failed to register for the election.");
    }
  };

  if (loading) return <div className="loading">Loading elections...</div>;

  return (
    <div className="elections-container">
      <h1 className="elections-title">Upcoming Elections</h1>

      {elections.length > 0 ? (
        <table className="elections-table">
          <thead>
            <tr>
              <th>Election Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {elections.map((election) => (
              <tr key={election._id}>
                <td>{election.name}</td>
                <td>{new Date(election.startDate).toLocaleDateString()}</td>
                <td>{new Date(election.endDate).toLocaleDateString()}</td>
                <td>{election.status}</td>
                <td>
                  <button
                    className="register-btn"
                    onClick={() => handleRegisterForElection(election._id)}
                  >
                    Register for Election
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-elections">No upcoming elections available.</p>
      )}

      <button className="back-btn" onClick={() => navigate("/candidate-panel")}>
        Back to Admin Panel
      </button>
    </div>
  );
};

export default ShowAllElections;
