const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  duration: { type: String, required: true }, // e.g., "Oct 2025 - Present"
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Experience', ExperienceSchema);