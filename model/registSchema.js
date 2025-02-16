const mongoose = require('mongoose');

const registSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    employeeID: { type: String, required: true, unique: true },
    DOB: { type: Date, required: true },
    gender: { type: String, required: true },
    Number: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    TransportAuthority: { type: String, required: true },
    busRoute: { type: String, required: true },
    busNumber: { type: String, required: true },
    experience: { type: Number, required: true },
    UserName: { type: String, required: true, unique: true },
    Password: { type: String, required: true } // Store hashed password for security
});

module.exports = mongoose.model("employees", registSchema);