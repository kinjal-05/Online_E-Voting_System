import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './CandidateEvents.css'; 

const CandidateEvents = () => {
  const [events, setEvents] = useState([]);
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchCandidate = async () => {
      if (!user || !user._id) {
        setError("User not found or invalid.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/candidates/candidates/${user._id}`
        );
        setCandidate(response.data);
      } catch (err) {
        console.error("Error fetching candidate data:", err);
        setError("Failed to load candidate.");
      }
    };

    fetchCandidate();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!candidate || !candidate._id) return;

      try {
        const eventsResponse = await axios.get(
          `http://localhost:5000/api/candidates/candidates/${candidate._id}/events`
        );

        if (!eventsResponse.data.events || eventsResponse.data.events.length === 0) {
          setEvents([]);
          setLoading(false);
          return;
        }

        const eventsWithDetails = await Promise.all(
          eventsResponse.data.events.map(async (event) => {
            try {
              const eventDetails = await axios.get(
                `http://localhost:5000/api/events/events/${event._id}`
              );
              return eventDetails.data;
            } catch (error) {
              console.error(`Error fetching event ${event._id}:`, error);
              return null;
            }
          })
        );

        setEvents(eventsWithDetails.filter((e) => e !== null));
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [candidate]);

  const handleDelete = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/events/events/${eventId}`);
      setEvents(events.filter((event) => event._id !== eventId));
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete event.");
    }
  };

  const handleUpdate = (eventId) => {
    navigate(`/update-event/${eventId}`);
  };

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="candidate-events-container">
      <h1 className="candidate-events-title">{candidate?.firstName} {candidate?.lastName}'s Events</h1>
      {events.length === 0 ? (
        <p className="no-events">No events found.</p>
      ) : (
        <ul className="events-list">
          {events.map((event) => (
            <li key={event._id} className="event-item">
              <h3 className="event-title">{event.title}</h3>
              <p className="event-description">{event.description}</p>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <div className="event-buttons">
                <button className="update-btn" onClick={() => handleUpdate(event._id)}>Update</button>
                <button className="delete-btn" onClick={() => handleDelete(event._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <button className="back-btn" onClick={() => navigate("/candidate-panel")}>
        Back to candidate panel
      </button>
    </div>
  );
};

export default CandidateEvents;
