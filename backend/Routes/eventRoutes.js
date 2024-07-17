const express = require('express');
const router = express.Router();
const { createEvent,getAllEvents, getUserEvents,updateEvent,deleteEvent,handleJoinEvent} = require("../Controllers/eventController");

// Create a new event
router.post('/create', createEvent);
// join 
router.post('/join',handleJoinEvent)
// Get all events
router.get('/getAll', getAllEvents);

// Get events for a specific user
router.get('/user/:userId', getUserEvents);

// Update an event
router.put('/:idevents/edit', updateEvent);

// Delete an event
router.delete('/:idevents/del', deleteEvent);

module.exports = router;