var express = require('express');
var router = express.Router();
var registSchema = require('../model/registSchema');
var bcrypt = require('bcrypt');

/* GET users listing. */
router.post('/', async function(req, res, next) {
    console.log("Registration Request Body:", req.body); // Log the request body to debug
    try {
        const hashedPassword = await bcrypt.hash(req.body.Password, 10);
        const data = new registSchema({
            ...req.body,
            Password: hashedPassword
        });
        await data.save();
        console.log("data saved");
        res.json({
            status: 'success',
            message: 'Data saved successfully'
        });
    } catch (e) {
        console.error("Error saving data:", e);
        res.status(500).json({
            status: 'error',
            message: 'Failed to save data',
            error: e.message
        });
    }
});

router.get("/", (req, res) => {
    res.json({ message: "employees API is working!" });
});

router.post("/login", async (req, res) => {
    console.log("Login Request:", req.body);
    const { UserName, Password } = req.body;

    if (!UserName || !Password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await registSchema.findOne({ UserName });
        console.log("User Found:", user);

        if (!user) {
            return res.status(401).json({ valid: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(Password, user.Password);
        console.log("Password Match:", isMatch);

        if (!isMatch) {
            return res.status(401).json({ valid: false, message: "Invalid credentials" });
        }

        res.status(200).json({ valid: true, message: "Login successful" });

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;