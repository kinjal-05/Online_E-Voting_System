import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './AddEvent.css'; 

const AddEvent = () => {
  const [eventDetails, setEventDetails] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [candidateId, setCandidateId] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const response = await axios.get(
          `https://voteguard-backend.onrender.com/api/candidates/candidates/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCandidateId(response.data._id);
      } catch (err) {
        console.error("Error fetching candidate:", err);
        setError("Failed to fetch candidate data. Please try again.");
      }
    };

    if (user && token) {
      fetchCandidate();
    }
  }, [user, token]);

  const handleChange = (e) => {
    setEventDetails({
      ...eventDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!eventDetails.title || !eventDetails.description || !eventDetails.date || !eventDetails.location) {
      setError("Please fill out all fields.");
      return;
    }

    if (!candidateId) {
      setError("Candidate not found. Please try again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://voteguard-backend.onrender.com/api/events/events",
        {
          ...eventDetails,
          candidateId: candidateId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Event added successfully!");
      navigate("/candidate-panel");
      setEventDetails({
        title: "",
        description: "",
        date: "",
        location: "",
      });
    } catch (err) {
      console.error("Error adding event:", err);
      setError("Failed to add event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-event-container">
      <h2 className="add-event-title">Add Event</h2>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <form className="add-event-form" onSubmit={handleSubmit}>
        <label>
          Event Title:
          <input
            type="text"
            name="title"
            value={eventDetails.title}
            onChange={handleChange}
            required
            className="input-field"
          />
        </label>

        <label>
          Description:
          <textarea
            name="description"
            value={eventDetails.description}
            onChange={handleChange}
            required
            className="input-field"
          />
        </label>

        <label>
          Date:
          <input
            type="date"
            name="date"
            value={eventDetails.date}
            onChange={handleChange}
            required
            className="input-field"
          />
        </label>

        <label>
          Location:
          <input
            type="text"
            name="location"
            value={eventDetails.location}
            onChange={handleChange}
            required
            className="input-field"
          />
        </label>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Adding..." : "Add Event"}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate("/candidate-panel")}>
            Cancel
          </button>
      </form>
    </div>
  );
};

export default AddEvent;
