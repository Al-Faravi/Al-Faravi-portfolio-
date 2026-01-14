const mongoose = require('mongoose');

const CertificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: String, required: true },
  skills: { type: [String] },
  credentialLink: { type: String },
  image: { type: String, default: "assets/default-cert.png" }
}, { timestamps: true });

module.exports = mongoose.model('Certification', CertificationSchema);