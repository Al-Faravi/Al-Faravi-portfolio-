require('dotenv').config();
const mongoose = require('mongoose');

// Import all models
const { Project, Experience, Certification, Status, Blog, Featured } = require('./models/PortfolioItem');

// Connect to DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected for Seeding'))
    .catch(err => {
        console.error('❌ DB Connection Error:', err);
        process.exit(1);
    });

const seedData = async () => {
    try {
        // 1. Clear Old Data
        await Project.deleteMany({});
        await Experience.deleteMany({});
        await Certification.deleteMany({});
        await Status.deleteMany({});
        await Blog.deleteMany({});
        await Featured.deleteMany({});
        
        console.log('🧹 Old Data Cleared...');

        // =========================================
        // 2. PREPARE DATA
        // =========================================

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

        // --- CERTIFICATIONS ---
        const certifications = [
            {
                title: "AWS Services Fundamentals",
                issuer: "Simplilearn (SkillUp)",
                date: "Oct 2025",
                image: "assets/aws-cloud.jfif", 
                credentialLink: "#",
                description: "Learned AWS core services and Cloud Computing fundamentals.",
                impact: "Skills gained: AWS, Cloud Computing"
            },
            {
                title: "AWS Cloud Technical Essentials",
                issuer: "Grameenphone Academy",
                date: "Sep 2025",
                image: "assets/aws-essentials.jfif",
                credentialLink: "#",
                description: "Deep dive into AWS technical essentials and serverless architecture.",
                impact: "Skills gained: AWS, Serverless"
            },
            {
                title: "Acing Aptitude Tests",
                issuer: "Grameenphone Academy",
                date: "Sep 2025",
                image: "assets/aptitude-test.jfif",
                credentialLink: "#",
                description: "Mastered problem-solving techniques for technical assessments.",
                impact: "Skills gained: Problem Solving, Critical Thinking"
            },
            {
                title: "Employability Skills Program",
                issuer: "Wadhwani Foundation",
                date: "Aug 2025",
                image: "assets/employability.jfif",
                credentialLink: "#",
                description: "Professional soft skills training for career readiness.",
                impact: "Skills gained: Professionalism, Communication"
            }
        ];

        // --- BLOGS (Problem Solving & Thoughts) ---
        const blogs = [
            {
                title: "কেন ডেটা অ্যানালিটিক্স বর্তমান সময়ের সবচেয়ে ডিমান্ডিং ক্যারিয়ার?",
                date: "Jan 15, 2026",
                content: `<p>বর্তমান বিশ্বে প্রতিটি সিদ্ধান্ত ডাটার ওপর ভিত্তি করে নেওয়া হয়। ব্যবসা থেকে শুরু করে স্বাস্থ্যখাত—সবখানেই ডাটার ব্যবহার। একজন ডেটা অ্যানালিস্ট হিসেবে আমি দেখেছি কিভাবে Raw Data কে ইনসাইটে রূপান্তর করে একটি ব্যবসার গতিপথ বদলে দেওয়া যায়।</p>
                <br>
                <h4>কেন শিখবেন?</h4>
                <ul>
                    <li>হাই স্যালারি এবং রিমোট জবের সুযোগ।</li>
                    <li>সিদ্ধান্ত গ্রহণে সরাসরি ভূমিকা রাখার ক্ষমতা।</li>
                    <li>Python, SQL এবং Power BI এর মতো টুলস শেখার সুযোগ।</li>
                </ul>`
            },
            {
                title: "Optimizing React App Performance by 40%",
                date: "Jan 10, 2026",
                content: `<p>React re-renders can kill performance. In this post, I discuss how I used <code>useMemo</code> and <code>React.memo</code> to reduce unnecessary renders in a dashboard application.</p>
                <p>By profiling the app using React DevTools, I identified bottlenecks in the DataGrid component and implemented virtualization to handle 10,000+ rows smoothly.</p>`
            },
            {
                title: "Integrating Python AI with Node.js Backend",
                date: "Dec 22, 2025",
                content: `<p>Microservices architecture is key when mixing stacks. I used <b>Flask</b> to serve the TensorFlow model as a REST API.</p>
                <p>The Node.js backend communicates with this Python service via HTTP requests. This separation allows the heavy ML processing (GPU intensive) to scale independently of the I/O-bound web server.</p>`
            }
        ];

        // --- FEATURED PROJECT ---
        // (ডাটাবেসে থাকলেও আমরা আপাতত হার্ডকোডেড HTML ব্যবহার করছি, 
        // তবে ফিউচারে ডাইনামিক করার জন্য ডাটাবেসে সেভ রাখা ভালো)
        const featured = [
            {
                title: "Chest X-ray Disease Classification",
                tag: "Research & AI Development",
                summary: "Detecting lung diseases manually is slow and error-prone. I built an end-to-end medical AI web application capable of classifying Chest X-rays into 6 categories with 96.92% Accuracy using ResNet101 and Grad-CAM.",
                accuracy: "96.92%",
                dataset: "12k+",
                model: "ResNet101",
                image: "assets/xray-project.png",
                githubLink: "https://github.com/Al-Faravi/Chest-X-ray-Classification-with-Deep-Learning"
            }
        ];

        // --- GLOBAL STATUS ---
        const status = {
            statusText: "Building AI solutions 🧠",
            statusColor: "#10B981"
        };

        // =========================================
        // 3. INSERT DATA
        // =========================================
        await Project.insertMany(projects);
        await Experience.insertMany(experience);
        await Certification.insertMany(certifications);
        await Blog.insertMany(blogs);
        await Featured.insertMany(featured);
        await Status.create(status);

        console.log('✅ All Data Imported Successfully!');
        process.exit();

    } catch (error) {
        console.error('❌ Error with data import:', error);
        process.exit(1);
    }
};

seedData();