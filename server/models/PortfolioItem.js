const mongoose = require('mongoose');

// 1. Project Schema
const ProjectSchema = new mongoose.Schema({
    title: String,
    category: String,
    description: String,
    techStack: [String],
    liveLink: String,
    githubLink: String
});

// 2. Experience Schema
const ExperienceSchema = new mongoose.Schema({
    role: String,
    company: String,
    duration: String
});

// 3. Certification Schema
const CertSchema = new mongoose.Schema({
    title: String,
    issuer: String,
    date: String,
    image: String,
    credentialLink: String,
    description: String,
    impact: String
});

// 4. Blog Schema
const BlogSchema = new mongoose.Schema({
    title: String,
    date: String,
    content: String
});

// 5. Featured Project Schema
const FeaturedSchema = new mongoose.Schema({
    title: String,
    tag: String,
    summary: String,
    accuracy: String,
    dataset: String,
    model: String,
    image: String,
    githubLink: String
});

// 6. Status Schema
const StatusSchema = new mongoose.Schema({
    statusText: String,
    statusColor: String
});

module.exports = {
    Project: mongoose.model('Project', ProjectSchema),
    Experience: mongoose.model('Experience', ExperienceSchema),
    Certification: mongoose.model('Certification', CertSchema),
    Blog: mongoose.model('Blog', BlogSchema),
    Featured: mongoose.model('Featured', FeaturedSchema),
    Status: mongoose.model('Status', StatusSchema)
};