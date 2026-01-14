const mongoose = require('mongoose');

const GlobalStatusSchema = new mongoose.Schema({
  statusText: { type: String, default: "Building cool stuff 🚀" },
  statusColor: { type: String, default: "#10B981" }, // Green
  isHiring: { type: Boolean, default: true }
});

module.exports = mongoose.model('GlobalStatus', GlobalStatusSchema);