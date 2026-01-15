const mongoose = require('mongoose');

const CertificationSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  issuer: { 
    type: String, 
    required: true 
  },
  date: { 
    type: String, 
    required: true 
  },
  // পপ-আপ মডালের জন্য নতুন ফিল্ড (What I Learned)
  description: { 
    type: String, 
    default: "Comprehensive training covering core concepts and practical applications." 
  },
  // পপ-আপ মডালের জন্য নতুন ফিল্ড (Impact)
  impact: { 
    type: String, 
    default: "Enhanced professional capability and applied knowledge in real-world projects." 
  },
  skills: { 
    type: [String],
    default: [] 
  },
  credentialLink: { 
    type: String, 
    default: "#" 
  },
  image: { 
    type: String, 
    default: "assets/default-cert.png" // ডিফল্ট ইমেজ যদি ইউজার না দেয়
  }
}, { timestamps: true });

module.exports = mongoose.model('Certification', CertificationSchema);