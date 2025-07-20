var express = require('express');
var router = express.Router();
var registSchema = require('../model/registSchema');
const bcrypt = require('bcryptjs');
const PassengerCount = require("../model/PassengerCountSchema"); 
const { v4: uuidv4 } = require('uuid'); // Add this at the to



/* GET users listing. */
// router.post('/', async function(req, res, next) {
//     try {
//         const hashedPassword = await bcrypt.hash(req.body.Password, 10);
//         const data = new registSchema({
//             ...req.body,
//             Password: hashedPassword
//         });
//         await data.save();
//         console.log("data saved");
//         res.json({
//             status: 'success',
//             message: 'Data saved successfully'
//         });
//     } catch (e) {
//         console.error(e);
//         res.status(500).json({
//             status: 'error',
//             message: 'Failed to save data',
//             error: e.message
//         });
//     }
// });



router.post("/login", async (req, res) => {
    const { UserName, Password } = req.body;

    if (!UserName || !Password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await registSchema.findOne({ UserName });

        if (!user) {
            return res.status(401).json({ valid: false, message: "User not found" });
        }

        // Compare plain text passwords
        if (Password !== user.Password) {
            return res.status(401).json({ valid: false, message: "Invalid credentials" });
        }

        const responsePayload = { 
            valid: true, 
            message: "Login successful",
            busId: user.busId || null,
            busNumber: user.busNumber || "Unknown",
            busRoute: user.busRoute || "Unknown"
        };

        res.status(200).json(responsePayload);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});


router.get("/", (req, res) => {
    res.json({ message: "employees API is working!" });
});


router.get('/test', async (req, res) => {
    try {
        const conductors = await registSchema.find({}); // Fetch all fields
        res.json(conductors);
    } catch (error) {
        console.error("Error fetching conductors:", error);
        res.status(500).json({ error: "Server error while fetching data" });
    }
});


router.post("/register", async function (req, res) {
    try {

        const data = new registSchema({
            ...req.body,
            
            busId: uuidv4() // Generate unique busId for each bus
        });

        await data.save();
        res.status(201).json({ message: "Bus registered successfully", busId: data.busId });
    } catch (error) {
        res.status(500).json({ message: "Error registering bus", error });
    }
});



// router.get('/busnumber  ', async (req, res) => {
//     try {
//         res.status(200).json({ status: 'success' });
//         const conductors = await registSchema.find({}, 'busNumber'); // Fetch only busNumber field
//         res.json(conductors);


//     } catch (error) {
//         console.error('Error fetching data:', error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// });
router.post("/passenger/add", async (req, res) => {
    const { busId } = req.body;
  
    try {
      let bus = await PassengerCount.findOne({ busId });
  
      if (!bus) {
        // If the bus doesn't exist, create a new record
        bus = new PassengerCount({ busId, count: 1 });
      } else {
        // If bus exists, increment count
        bus.count += 1;
      }
  
      await bus.save(); // Save the updated count
      res.json({ success: true, count: bus.count });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
  router.get("/passenger/count", async (req, res) => {
    const { busId } = req.query;
  
    try {
      const bus = await PassengerCount.findOne({ busId });
  
      if (!bus) {
        return res.json({ success: true, count: 0 }); // Default count = 0 if not found
      }
  
      res.json({ success: true, count: bus.count });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
  
  


module.exports = router;