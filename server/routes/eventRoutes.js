const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth"); 
const eventController = require("../controllers/eventController"); 


router.post("/events", authMiddleware, eventController.createEvent);
router.get("/events/:_id", eventController.getEventById);
router.get("/events", eventController.getAllEvents);
router.put("/events/:eventId", eventController.updateEvent);
router.delete("/events/:eventId", eventController.deleteEvent);
module.exports = router;
