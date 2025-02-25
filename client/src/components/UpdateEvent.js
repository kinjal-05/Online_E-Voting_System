import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./UpdateEvent.css"; 

const UpdateEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/events/${eventId}`);
        setEvent({
          title: response.data.title,
          description: response.data.description,
          date: response.data.date.split("T")[0], 
          location: response.data.location,
        });
      } catch (err) {
        setError("Failed to load event details.");
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await axios.put(`http://localhost:5000/api/events/events/${eventId}`, event);
      setSuccess("Event updated successfully!");
      setTimeout(() => navigate("/candidate-events"), 2000);
    } catch (err) {
      setError("Failed to update event.");
    }
  };

  return (
    <div className="update-event-container">
      <div className="update-event-card">
        <h2 className="update-event-title">Update Event</h2>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <form onSubmit={handleSubmit} className="update-event-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={event.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={event.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={event.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={event.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>

          <button type="button" className="btn btn-secondary" onClick={() => navigate("/candidate-events")}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateEvent;
