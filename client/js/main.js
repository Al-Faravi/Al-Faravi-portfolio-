const API_URL = 'http://localhost:5000/api';

// Global variable for projects (used in Modal)
let allProjects = [];

// --- 1. DATA FETCHING ---
async function fetchData() {
    try {
        // Fetch Status
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

        // Fetch Projects
        const projRes = await fetch(`${API_URL}/projects`);
        allProjects = await projRes.json();
        const projContainer = document.getElementById('project-grid');
        
        if (allProjects.length > 0 && projContainer) {
            projContainer.innerHTML = allProjects.map((p, index) => `
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

        // Fetch Experience
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
        } else if (expContainer) {
            expContainer.innerHTML = "<p>No experience loaded.</p>";
        }

        // Fetch Certifications
        const certRes = await fetch(`${API_URL}/certifications`);
        const certs = await certRes.json();
        const certContainer = document.getElementById('cert-grid');

        if (certs.length > 0 && certContainer) {
            certContainer.innerHTML = certs.map(c => `
                <a href="${c.credentialLink || '#'}" target="_blank" class="cert-card">
                    <div class="cert-img-box">
                        <img src="${c.image}" alt="${c.issuer}" class="cert-img" onerror="this.src='https://via.placeholder.com/100'">
                    </div>
                    <div class="cert-info">
                        <h3>${c.title}</h3>
                        <div class="cert-issuer">${c.issuer}</div>
                        <div class="cert-date">Issued ${c.date}</div>
                    </div>
                </a>
            `).join('');
        } else if (certContainer) {
            certContainer.innerHTML = "<p>No certifications listed.</p>";
        }

    } catch (error) {
        console.error("API Error:", error);
    }
}

// --- 2. MODAL LOGIC (Pop-up) ---
const modal = document.getElementById('modal-overlay');
const closeBtn = document.getElementById('close-modal');

// Global openModal for HTML onclick
window.openModal = function(index) {
    if (!allProjects[index]) return;
    const project = allProjects[index];
    
    // Set Content
    const setContent = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.innerText = text;
    };

    setContent('m-category', project.category || "Project");
    setContent('m-title', project.title);
    setContent('m-desc', project.description);
    setContent('m-tech', project.techStack ? project.techStack.join(' • ') : '');
    
    // Handle Links
    const liveBtn = document.getElementById('m-live');
    const githubBtn = document.getElementById('m-github');

    if(liveBtn) {
        if(project.liveLink) {
            liveBtn.style.display = 'inline-block';
            liveBtn.href = project.liveLink;
        } else {
            liveBtn.style.display = 'none';
        }
    }

    if(githubBtn) {
        if(project.githubLink) {
            githubBtn.style.display = 'inline-block';
            githubBtn.href = project.githubLink;
        } else {
            githubBtn.style.display = 'none';
        }
    }

    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
    }
}

function closeModal() {
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
    }
}

if(closeBtn) closeBtn.addEventListener('click', closeModal);
if(modal) modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// --- 3. CONTACT FORM LOGIC ---
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
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: json
            });
            
            const result = await res.json();

            if (result.success) {
                if (formResult) {
                    formResult.innerText = "Message sent successfully! ✅";
                    formResult.style.color = "green";
                }
                contactForm.reset(); 
            } else {
                throw new Error("Form submission failed");
            }
        } catch (error) {
            console.error(error);
            if (formResult) {
                formResult.innerText = "Something went wrong. Please try again.";
                formResult.style.color = "red";
            }
        } finally {
            setTimeout(() => {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
                if (formResult) {
                    setTimeout(() => { formResult.innerText = ""; }, 5000);
                }
            }, 1000);
        }
    });
}

// --- 4. HAMBURGER MENU LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Toggle Menu
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation(); // Stop event bubbling
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close Menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        });
    });

    // Close Menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('active')) {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    });

    // Make closeMenu available globally (Fallback for HTML onclick)
    window.closeMenu = function() {
        if (navMenu) navMenu.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
    };
});

// --- 5. ADMIN SHORTCUT (Ctrl + Shift + L) ---
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        window.location.href = 'admin.html';
    }
});

// Run Data Fetch on Load
document.addEventListener('DOMContentLoaded', fetchData);