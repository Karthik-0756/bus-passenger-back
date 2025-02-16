const express = require('express');
const router = express.Router();
const routeSchema = require('../model/BusStop'); // Adjust the path if your model is in a different folder

// Add a New Bus Stop
router.post('/add', async (req, res) => {
  try {
    const busStop = new routeSchema(req.body); // req.body should contain "name", "latitude", and "longitude"
    await busStop.save();
    res.status(201).json({ status: 'success', message: 'Bus stop added successfully!' });
  } catch (error) {
    console.error('Error adding bus stop:', error);
    res.status(500).json({ status: 'error', message: 'Failed to add bus stop' });
  }
});

// bus-location update
router.post('/update-location', async (req, res) => {
  try {
    const { latitude, longitude, name } = req.body;

    // Fetch the bus stop by name
    const busStop = await BusStop.findOne({ name });

    if (!busStop) {
      return res.status(404).json({ status: "error", message: "Bus stop not found" });
    }

    // Check if the bus has reached the stop by comparing the coordinates
    if (
      Math.abs(busStop.latitude - latitude) < 0.0005 &&
      Math.abs(busStop.longitude - longitude) < 0.0005
    ) {
      return res.json({
        status: "success",
        message: `Bus has reached the stop ${busStop.name}`,
      });
    }

    res.json({
      status: "success",
      message: "Bus is still on the route.",
    });
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});




// Get All Bus Stops
router.get('/', async (req, res) => {
  try {
    const busStops = await routeSchema.find(); // Fetch all bus stops
    res.status(200).json({ status: 'success', data: busStops });
  } catch (error) {
    console.error('Error fetching bus stops:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch bus stops' });
  }
});

//checking purpose ofr the FE gives data to BE
router.get('/test', (req, res) => {
  res.send('Route is working');
  res.status(201).json({ status: 'success', message: 'Bus stop ' });

});


// Search Bus Stops by Name (Partial Match)
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query; // User input sent as a query string, e.g., /route/search?query=p
    if (!query) {
      return res.status(400).json({ status: 'error', message: 'Query parameter is required' });
    }
    const results = await routeSchema.find({ name: { $regex: query, $options: 'i' } }); // Case-insensitive search
    if (results.length > 0) {
      res.status(200).json({ status: 'success', data: results });
    } else {
      res.status(404).json({ status: 'error', message: 'No bus stops found' });
    }
  } catch (error) {
    console.error('Error searching bus stops:', error);
    res.status(500).json({ status: 'error', message: 'Failed to search bus stops' });
  }
});

// Function to calculate distance using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Endpoint to calculate distance between current location and end stop
router.post('/calculate-distance', async (req, res) => {
  try {
    const { currentLatitude, currentLongitude, endStopName } = req.body;

    // Fetch the end stop details from the database using its name
    const endStop = await routeSchema.findOne({ name: endStopName });

    if (!endStop) {
      return res.status(404).json({ status: 'error', message: 'End stop not found' });
    }

    // Calculate the distance between the current location and the end stop
    const distance = calculateDistance(
      currentLatitude,
      currentLongitude,
      endStop.latitude,
      endStop.longitude
    );

    res.status(200).json({
      status: 'success',
      message: 'Distance calculated successfully',
      distance,
    });
  } catch (error) {
    console.error('Error calculating distance:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});
module.exports = router;


