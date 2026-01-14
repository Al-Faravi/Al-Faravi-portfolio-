const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  techStack: { type: [String], required: true },
  liveLink: { type: String },
  githubLink: { type: String },
  category: { type: String, default: 'Full Stack' },
  image: { type: String, default: "https://via.placeholder.com/300" }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);