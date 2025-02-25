const Event = require("../models/Event"); 
const Candidate = require("../models/Candidate"); 


const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, candidateId } = req.body;

    
    if (!candidateId || !title || !description || !date || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

  
    const newEvent = new Event({
      title,
      description,
      date,
      location,
      candidateId,
    });

  
    const savedEvent = await newEvent.save();


    const updatedCandidate = await Candidate.findByIdAndUpdate(
      candidateId,
      { $push: { events: savedEvent._id } }, 
      { new: true }
    );

    if (!updatedCandidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

  
    res.status(201).json({
      message: "Event created and candidate updated successfully.",
      event: savedEvent,
      candidate: updatedCandidate,
    });
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ message: "Server error. Failed to create event." });
  }
};
const getEventById = async (req, res) => {
    try {
      const _id = req.params._id; 
      console.log(_id);
  
      const event = await Event.findById(_id);
      console.log(event);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      console.log(event);
  
      res.status(200).json(event);
    } catch (err) {
      console.error("Error fetching event:", err);
      res.status(500).json({ message: "Failed to fetch event" });
    }
  };

  const getAllEvents = async (req, res) => {
    try {
      const events = await Event.find();
      console.log(events);
      res.status(200).json(events);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching events.' });
    }
  };
  const updateEvent = async (req, res) => {
    try {
      const { title, description, date, location } = req.body;
      
      const updatedEvent = await Event.findByIdAndUpdate(
        req.params.eventId,
        { title, description, date, location },
        { new: true }
      );
  
      if (!updatedEvent) {
        return res.status(404).json({ message: "Event not found" });
      }
  
      res.json({ message: "Event updated successfully", event: updatedEvent });
    } catch (error) {
      res.status(500).json({ message: "Error updating event", error });
    }
  };
  const deleteEvent = async (req, res) => {
    try {
      const event = await Event.findById(req.params.eventId);
  
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
  
      await Event.findByIdAndDelete(req.params.eventId);
      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting event", error });
    }
  };
module.exports = {
  createEvent,getEventById,getAllEvents,updateEvent,deleteEvent
};
