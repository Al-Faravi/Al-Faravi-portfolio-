const API_URL = 'http://localhost:5000/api';

// --- GLOBAL VARIABLES (Data Storage) ---
let allProjects = [];
let allCerts = [];

// Blog Dummy Data (Since no backend for blogs yet)
const blogData = {
    1: { 
        title: "Optimizing React Performance by 40%", 
        date: "Jan 10, 2026", 
        content: "React re-renders can kill performance. In this post, I discuss how I used <code>useMemo</code> and <code>React.memo</code> to reduce unnecessary renders in a dashboard application. By profiling the app using React DevTools, I identified bottlenecks in the DataGrid component and implemented virtualization to handle 10,000+ rows smoothly." 
    },
    2: { 
        title: "Integrating Python AI with Node.js", 
        date: "Dec 22, 2025", 
        content: "Microservices architecture is key when mixing stacks. I used <b>Flask</b> to serve the TensorFlow model as a REST API. The Node.js backend communicates with this Python service via HTTP requests. This separation allows the heavy ML processing (GPU intensive) to scale independently of the I/O-bound web server." 
    },
    3: { 
        title: "Why MongoDB for LMS Architecture?", 
        date: "Nov 15, 2025", 
        content: "SQL is rigid. For an LMS where course structures vary (videos, quizzes, assignments), MongoDB's flexible schema allowed us to iterate features 2x faster. We utilized <b>Compound Indexes</b> for fast queries and Aggregation Pipelines for generating complex student performance reports." 
    }
};

// =========================================
// 1. DATA FETCHING & RENDERING
// =========================================
async function fetchData() {
    try {
        // --- 1.1 Fetch Status ---
        const statusRes = await fetch(`${API_URL}/status`);
        const statusData = await statusRes.json();
        const statusText = document.getElementById('status-text');
        const statusDot = document.querySelector('.status-dot');
        
        if (statusText && statusData.statusText) {
            statusText.innerText = statusData.statusText;
            if (statusDot) {
                statusDot.style.backgroundColor = statusData.statusColor;
                statusDot.style.boxShadow = `0 0 8px ${statusData.statusColor}`;
            }
        }

        // --- 1.2 Fetch Projects ---
        const projRes = await fetch(`${API_URL}/projects`);
        allProjects = await projRes.json();
        const projContainer = document.getElementById('project-grid');
        
        if (allProjects.length > 0 && projContainer) {
            // Check if we are on the "All Projects" page or "Home" page
            const isAllProjectsPage = document.body.classList.contains('projects-page');
            
            // If Home page, show 6. If Projects page, show all.
            const displayProjects = isAllProjectsPage ? allProjects : allProjects.slice(0, 6);
            
            projContainer.innerHTML = displayProjects.map((p, index) => `
                <div class="project-card" onclick="openModal(${index})">
                    <h3 class="project-title">${p.title}</h3>
                    <p class="project-desc">${p.description.substring(0, 80)}...</p>
                    <div class="tech-stack">${p.techStack.slice(0, 3).join(' • ')}</div>
                    <span style="font-size:0.8rem; text-decoration:underline; margin-top:15px; display:block; color:#10B981;">Read Details &rarr;</span>
                </div>
            `).join('');
        } else if (projContainer) {
            projContainer.innerHTML = "<p>No projects loaded.</p>";
        }

        // --- 1.3 Fetch Experience ---
        const expRes = await fetch(`${API_URL}/experience`);
        const experiences = await expRes.json();
        const expContainer = document.getElementById('experience-list');

        if (experiences.length > 0 && expContainer) {
            expContainer.innerHTML = experiences.map(e => `
                <div class="experience-item">
                    <div>
                        <h3>${e.role}</h3>
                        <span class="role-company">${e.company}</span>
                    </div>
                    <div class="exp-date">${e.duration}</div>
                </div>
            `).join('');
        }

        // --- 1.4 Fetch Certifications ---
        const certRes = await fetch(`${API_URL}/certifications`);
        allCerts = await certRes.json();
        const certContainer = document.getElementById('cert-grid');

        if (allCerts.length > 0 && certContainer) {
            certContainer.innerHTML = allCerts.map((c, index) => `
                <div class="cert-card" onclick="openCertModal(${index})" style="cursor: pointer;">
                    <div class="cert-img-box">
                        <img src="${c.image}" alt="${c.issuer}" class="cert-img" onerror="this.src='https://via.placeholder.com/100'">
                    </div>
                    <div class="cert-info">
                        <h3>${c.title}</h3>
                        <div class="cert-issuer">${c.issuer}</div>
                        <div class="cert-date">Issued ${c.date}</div>
                    </div>
                </div>
            `).join('');
        }

    } catch (error) {
        console.error("API Error:", error);
    }
}

// =========================================
// 2. MODAL LOGIC HANDLERS
// =========================================

// --- 2.1 General Project Modal ---
const projectModal = document.getElementById('modal-overlay');

window.openModal = function(index) {
    if (!allProjects[index]) return;
    const project = allProjects[index];
    
    // Populate Modal
    document.getElementById('m-category').innerText = project.category || "Project";
    document.getElementById('m-title').innerText = project.title;
    document.getElementById('m-desc').innerText = project.description;
    document.getElementById('m-tech').innerText = project.techStack ? project.techStack.join(' • ') : '';
    
    const liveBtn = document.getElementById('m-live');
    const githubBtn = document.getElementById('m-github');

    if(liveBtn) {
        liveBtn.style.display = project.liveLink ? 'inline-block' : 'none';
        liveBtn.href = project.liveLink || '#';
    }
    if(githubBtn) {
        githubBtn.style.display = project.githubLink ? 'inline-block' : 'none';
        githubBtn.href = project.githubLink || '#';
    }

    if (projectModal) {
        projectModal.style.display = 'flex';
        setTimeout(() => projectModal.classList.add('active'), 10);
    }
}

// --- 2.2 Featured Project Modal ---
const featuredModal = document.getElementById('featured-modal');

window.openFeaturedModal = function() {
    if (featuredModal) {
        featuredModal.style.display = 'flex';
        setTimeout(() => featuredModal.classList.add('active'), 10);
    }
};

window.closeFeaturedModal = function() {
    if (featuredModal) {
        featuredModal.classList.remove('active');
        setTimeout(() => featuredModal.style.display = 'none', 300);
    }
};

// --- 2.3 Certification Modal ---
const certModal = document.getElementById('cert-modal');

window.openCertModal = function(index) {
    if (!allCerts[index] || !certModal) return;
    const cert = allCerts[index];

    // Populate Data
    document.getElementById('c-title').innerText = cert.title;
    document.getElementById('c-issuer').innerText = cert.issuer;
    // Using simple fallback description if DB is empty
    document.getElementById('c-desc').innerText = cert.description || `Successfully completed the ${cert.title} certification, mastering key concepts and tools required for professional development.`;
    document.getElementById('c-impact').innerText = cert.impact || "This certification validated my skills and improved my efficiency in building scalable solutions.";
    
    const verifyLink = document.getElementById('c-link');
    if(verifyLink) {
        verifyLink.href = cert.credentialLink || '#';
        verifyLink.style.display = cert.credentialLink ? 'inline-block' : 'none';
    }

    certModal.style.display = 'flex';
    setTimeout(() => certModal.classList.add('active'), 10);
}

window.closeCertModal = function() {
    if (certModal) {
        certModal.classList.remove('active');
        setTimeout(() => certModal.style.display = 'none', 300);
    }
}

// --- 2.4 Blog Modal ---
const blogModal = document.getElementById('blog-modal');

window.openBlogModal = function(id) {
    if(!blogModal || !blogData[id]) return;
    const blog = blogData[id];
    
    document.getElementById('b-title').innerText = blog.title;
    document.getElementById('b-date').innerText = blog.date;
    document.getElementById('b-content').innerHTML = `<p>${blog.content}</p>`;
    
    blogModal.style.display = 'flex';
    setTimeout(() => blogModal.classList.add('active'), 10);
}

window.closeBlogModal = function() {
    if (blogModal) {
        blogModal.classList.remove('active');
        setTimeout(() => blogModal.style.display = 'none', 300);
    }
}

// --- 2.5 General Close Handler ---
const closeBtn = document.getElementById('close-modal');
if(closeBtn) {
    closeBtn.addEventListener('click', () => {
        projectModal.classList.remove('active');
        setTimeout(() => projectModal.style.display = 'none', 300);
    });
}

// Close ALL modals on outside click
window.onclick = function(event) {
    if (event.target == projectModal) {
        projectModal.classList.remove('active');
        setTimeout(() => projectModal.style.display = 'none', 300);
    }
    if (event.target == featuredModal) window.closeFeaturedModal();
    if (event.target == certModal) window.closeCertModal();
    if (event.target == blogModal) window.closeBlogModal();
}

// =========================================
// 3. CONTACT FORM LOGIC
// =========================================
const contactForm = document.getElementById('contact-form');
const formResult = document.getElementById('form-result');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('.btn-submit-form');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "Sending...";
        submitBtn.disabled = true;

        const formData = new FormData(contactForm);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        try {
            const res = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: json
            });
            const result = await res.json();
            if (result.success) {
                if (formResult) {
                    formResult.innerText = "Message sent successfully! ✅";
                    formResult.style.color = "green";
                }
                contactForm.reset(); 
            } else { throw new Error("Failed"); }
        } catch (error) {
            console.error(error);
            if (formResult) {
                formResult.innerText = "Error sending message.";
                formResult.style.color = "red";
            }
        } finally {
            setTimeout(() => {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
                if (formResult) setTimeout(() => { formResult.innerText = ""; }, 5000);
            }, 1000);
        }
    });
}

// =========================================
// 4. HAMBURGER & ADMIN SHORTCUT
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('active')) {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    });

    window.closeMenu = function() {
        if (navMenu) navMenu.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
    };
});

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        window.location.href = 'admin.html';
    }
});

// INITIALIZE
document.addEventListener('DOMContentLoaded', fetchData);