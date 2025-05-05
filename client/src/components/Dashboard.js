import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [error, setError] = useState("");
  const [showEvents, setShowEvents] = useState(false); // Added missing state

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("https://voteguard-backend.onrender.com/api/events/events");
        setEvents(response.data);
      } catch (err) {
        setError("Error fetching events.");
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (user) {
      const storedRole = localStorage.getItem("role");
      setRole(storedRole || "voter");
    }
  }, [user]);

  useEffect(() => {
    if (role && user) {
      if (role === "admin") {
        navigate("/admin-panel");
      } else if (role === "candidate") {
        navigate("/candidate-panel");
      }
    }
  }, [role, user, navigate]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleToggleEvents = () => {
    setShowEvents((prev) => !prev);
  };

  return (
    <>
    <div className="dashboard-container">
      {user ? (
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1 className="welcome-message" style={{ color: 'black', fontWeight: 'bold' }}>Welcome</h1>

            {role === "admin" ? (
              <div>
                <h2>Admin Panel</h2>
                <button onClick={() => navigate("/admin-panel")}>Go to Admin Panel</button>
              </div>
            ) : role === "candidate" ? (
              <div>
                <h2>Candidate Panel</h2>
                <button onClick={() => navigate("/candidate-panel")}>Go to Candidate Panel</button>
              </div>
            ) : (
              <div>
                <h2>Dashboard</h2>
                <p>You are not registered as a candidate yet.</p>
                <button onClick={() => navigate("/register-candidate")}>Register as Candidate</button>
              </div>
            )}
          </div>

          <div className="button-container">
            <button onClick={handleLogout}>Logout</button>
            <button onClick={() => navigate("/view-results")}>View Results</button>
          </div>
        </div>
      ) : (
        // <div className="dashboard-content">
        //   <h1 style={{ color: 'white', fontWeight: 'bold' }}>Welcome</h1>
        //   <p style={{ color: 'white', fontWeight: 'bold' }}>Please log in or register to access the dashboard.</p>
        //   <div className="button-container">
        //     <button onClick={() => navigate("/login")}>Login</button>
        //     <button onClick={() => navigate("/register")}>Register</button>
        //     <button onClick={handleToggleEvents}>
        //     {showEvents ? "Hide Events" : "Show Upcoming Events"}
        //   </button>
        //   </div>
        // </div>
        <div className="dashboard-guest-container">
  <div className="dashboard-content">
    <h1 style={{ color: 'white', fontWeight: 'bold' }}>Welcome</h1>
    <p style={{ color: 'white', fontWeight: 'bold' }}>
      Please log in or register to access the dashboard.
    </p>
    <div className="button-container">
      <button onClick={() => navigate("/login")}>Login</button>
      <button onClick={() => navigate("/register")}>Register</button>
      <button onClick={handleToggleEvents}>
        {showEvents ? "Hide Events" : "Show Upcoming Events"}
      </button>
    </div>
  </div>
</div>

      )}


    </div>
          <div className="events-section">
         
          {showEvents && (
            <>
              <h1>Upcoming Events</h1>
              {loadingEvents ? (
                <p>Loading events...</p>
              ) : error ? (
                <p style={{ color: "red",backgroundColor:"black" }}>{error}</p>
              ) : (
                <ul>
                  {events.length > 0 ? (
                    events.map((event) => (
                      <li key={event._id}>
                        <h4>{event.title}</h4>
                        <p>{event.description}</p>
                        <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                        <p>Location: {event.location}</p>
                      </li>
                    ))
                  ) : (
                    <p>No events available.</p>
                  )}
                </ul>
              )}
            </>
          )}
        </div>
        </>
  );
};

export default Dashboard;
