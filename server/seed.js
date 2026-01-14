require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('./models/Project');
const Experience = require('./models/Experience');
const GlobalStatus = require('./models/GlobalStatus');
const Certification = require('./models/Certification');

// Connect to DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected for Seeding'))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

const seedData = async () => {
    try {
        // 1. Clear Old Data
        await Project.deleteMany({});
        await Experience.deleteMany({});
        await GlobalStatus.deleteMany({});
        await Certification.deleteMany({});
        console.log('🧹 Old Data Cleared...');

        // --- PROJECTS ---
        const projects = [
            {
                title: "CareerLift Hybrid LMS Portal",
                description: "A production-grade Learning Management System (LMS) designed to bridge the gap between offline and online education. I engineered a scalable full-stack architecture using Node.js and MongoDB to handle 500+ student records efficiently.\n\nKey features include secure JWT Authentication, Role-Based Access Control (RBAC) and a Glassmorphism UI.",
                techStack: ["Node.js", "Express", "MongoDB", "JWT"],
                category: "Full Stack",
                liveLink: "https://www.csdibd.com",
                githubLink: "https://github.com/careerliftinstitute/careerlift-lms"
            },
            {
                title: "Chest X-ray Disease Classification",
                description: "An end-to-end medical AI application capable of detecting 6 specific lung diseases from X-ray images with 96.92% accuracy using ResNet101 and Grad-CAM.",
                techStack: ["Python", "TensorFlow", "Flask", "OpenCV"],
                category: "AI/ML",
                liveLink: "",
                githubLink: "https://github.com/Al-Faravi/Chest-X-ray-Classification-with-Deep-Learning"
            },
            {
                title: "IPL Comprehensive Data Analysis",
                description: "Deep-dive analysis of 17 seasons of IPL data using Power BI and SQL. Created DAX measures for real-time KPIs and interactive dashboards.",
                techStack: ["Power BI", "DAX", "SQL"],
                category: "Data Analysis",
                liveLink: "https://app.powerbi.com/groups/me/reports/cc51f25d-30f7-4aaa-b8a6-dc1ce398b6be/32c71af01337d1e719b6?experience=power-bi",
                githubLink: "https://github.com/Al-Faravi/IPL-PBI-Project"
            },
            {
                title: "Brain Tumor Classification AI",
                description: "Developed a life-saving AI tool designed to classify brain MRI scans into four distinct tumor categories with an impressive 98.37% accuracy.",
                techStack: ["Python", "Keras", "TensorFlow", "Flask"],
                category: "AI/ML",
                liveLink: "",
                githubLink: "https://github.com/Al-Faravi/Brain_Tumor_Classification"
            },
            {
                title: "Pizza Sales Strategic Analysis",
                description: "Analyzed over 48,620 sales records to provide actionable business insights for a retail pizza chain using SQL and Power BI.",
                techStack: ["SQL Server", "Power BI", "DAX"],
                category: "Data Analysis",
                liveLink: "https://app.powerbi.com/groups/me/reports/53fc6fb2-82cb-47de-872c-bd680fbc81f9/09ba20e0c961311ab0c8?experience=power-bi",
                githubLink: "https://github.com/Al-Faravi/pizza-sales-analysis"
            }
        ];

        // --- EXPERIENCE ---
        const experience = [
            {
                company: "Careerlift Skill Development Institute",
                role: "Information Executive",
                duration: "Oct 2025 – Present",
                description: "Leading IT operations, developed Hybrid LMS portal, and executing digital marketing strategies."
            },
            {
                company: "Information Services Network Ltd (ISN)",
                role: "Network Engineer Intern",
                duration: "Sept 2024 – Dec 2024",
                description: "Optimized ISP networks, reduced downtime by 15%, and implemented security protocols."
            }
        ];

        // --- CERTIFICATIONS (Corrected Paths) ---
        const certifications = [
            {
                title: "AWS Services Fundamentals",
                issuer: "Simplilearn (SkillUp)",
                date: "Oct 2025",
                skills: ["AWS", "Cloud Computing"],
                // "client/" বাদ দিতে হবে 👇
                image: "assets/aws-cloud.jfif", 
                credentialLink: "#"
            },
            {
                title: "AWS Cloud Technical Essentials",
                issuer: "Grameenphone Academy",
                date: "Sep 2025",
                skills: ["AWS", "Serverless"],
                image: "assets/aws-essentials.jfif",
                credentialLink: "#"
            },
            {
                title: "Acing Aptitude Tests",
                issuer: "Grameenphone Academy",
                date: "Sep 2025",
                skills: ["Problem Solving"],
                image: "assets/aptitude-test.jfif",
                credentialLink: "#"
            },
            {
                title: "Employability Skills Program",
                issuer: "Wadhwani Foundation",
                date: "Aug 2025",
                skills: ["Professionalism", "Soft Skills"],
                image: "assets/employability.jfif",
                credentialLink: "#"
            }
        ];

        // --- GLOBAL STATUS ---
        const status = {
            statusText: "Building AI solutions 🧠",
            statusColor: "#10B981",
            isHiring: true
        };

        // Insert All Data
        await Project.insertMany(projects);
        await Experience.insertMany(experience);
        await Certification.insertMany(certifications);
        await GlobalStatus.create(status);

        console.log('✅ All Data Imported Successfully!');
        process.exit();

    } catch (error) {
        console.error('❌ Error with data import', error);
        process.exit(1);
    }
};

seedData();