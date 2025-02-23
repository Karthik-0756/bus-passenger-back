const mongoose = require('mongoose');

const PassengerCountSchema = new mongoose.Schema({
  busId: { type: String, required: true }, 
  count: { type: Number, required: true, default: 0 }
});


module.exports = mongoose.model('PassengerCount', PassengerCountSchema);
