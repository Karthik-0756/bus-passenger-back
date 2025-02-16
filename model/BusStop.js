const mongoose = require('mongoose');

const BusStopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true }
 // Link stops to a route
});

module.exports = mongoose.model('BusStop', BusStopSchema);
