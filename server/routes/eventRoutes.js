// server/routes/eventRoutes.js
const express = require("express");
const router = express.Router();
const Event = require("../models/event");

// Get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// Create new event (optional - for testing via Postman)
router.post("/", async (req, res) => {
  const { title, description, date, status, image } = req.body;
  try {
    const event = new Event({ title, description, date, status, image });
    await event.save();
    res.json({ message: "Event created", event });
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ error: "Failed to create event" });
  }
});

module.exports = router;
