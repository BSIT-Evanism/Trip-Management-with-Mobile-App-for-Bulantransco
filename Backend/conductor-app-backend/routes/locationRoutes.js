const express = require('express');
const { addLocation, getAllLocations, clearLocations } = require('../controllers/locationController');

const router = express.Router();

// Route to add a new location
router.post('/add-location', addLocation);

// Route to get all locations with their count
router.get('/locations', getAllLocations);

// Route to clear all locations
router.delete('/clear-locations', clearLocations);

module.exports = router;
