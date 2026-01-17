// const API_URL = 'http://localhost:5000/api';
const API_URL = '/api'; // Vercel Deployment Relative Path

// --- GLOBAL VARIABLES (Data Storage) ---
let allProjects = [];
let allCerts = [];
let allBlogs = [];
let allFeatured = []; // 🟢 Featured Data

// =========================================
// 1. SLIDER CONTROLS (NEW ADDITION)
// =========================================
window.slideRight = function() {
    const slider = document.getElementById('featured-slider');
    if (slider) {
        slider.scrollBy({ left: slider.clientWidth, behavior: 'smooth' });
    }
};

window.slideLeft = function() {
    const slider = document.getElementById('featured-slider');
    if (slider) {
        slider.scrollBy({ left: -slider.clientWidth, behavior: 'smooth' });
    }
};

// =========================================
// 2. DATA FETCHING & RENDERING
// =========================================
async function fetchData() {
    try {
        // --- 2.1 Fetch Status ---
        const statusRes = await fetch(`${API_URL}/status`);
        if(statusRes.ok) {
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
        }

        // --- 2.2 Fetch Projects ---
        const projRes = await fetch(`${API_URL}/projects`);
        if(projRes.ok) {
            allProjects = await projRes.json();
            const projContainer = document.getElementById('project-grid');
            
            if (allProjects.length > 0 && projContainer) {
                const isAllProjectsPage = document.body.classList.contains('projects-page');
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
        }

        // --- 2.3 Fetch Featured Spotlight ---
        const featRes = await fetch(`${API_URL}/featured`);
        if(featRes.ok) {
            allFeatured = await featRes.json();
            const sliderContainer = document.getElementById('featured-slider');

            if (allFeatured.length > 0 && sliderContainer) {
                sliderContainer.innerHTML = allFeatured.map((f, index) => `
                    <div class="featured-wrapper">
                        <div class="featured-content">
                            <span class="featured-tag">${f.tag || 'Showcase'}</span>
                            <h3>${f.title}</h3>
                            <p class="featured-summary">${f.summary}</p>
                            
                            <div class="featured-stats">
                                ${f.accuracy ? `<div class="stat"><strong>${f.accuracy}</strong> Accuracy</div>` : ''}
                                ${f.dataset ? `<div class="stat"><strong>${f.dataset}</strong> Dataset</div>` : ''}
                                ${f.model ? `<div class="stat"><strong>${f.model}</strong> Model</div>` : ''}
                            </div>
                            
                            <button onclick="openFeaturedModal(${index})" class="btn-featured">Read Full Case Study &rarr;</button>
                        </div>
                        <div class="featured-image">
                            <img src="${f.image}" onerror="this.src='https://via.placeholder.com/600x400?text=Featured'" alt="${f.title}">
                        </div>
                    </div>
                `).join('');
            } else if (sliderContainer) {
                sliderContainer.innerHTML = "<p style='text-align:center; width:100%;'>No featured items yet.</p>";
            }
        }

        // --- 2.4 Fetch Experience ---
        const expRes = await fetch(`${API_URL}/experience`);
        if(expRes.ok) {
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
        }

        // --- 2.5 Fetch Certifications ---
        const certRes = await fetch(`${API_URL}/certs`);
        if(certRes.ok) {
            allCerts = await certRes.json();
            const certContainer = document.getElementById('cert-grid');

            if (allCerts.length > 0 && certContainer) {
                certContainer.innerHTML = allCerts.map((c, index) => `
                    <div class="cert-card" onclick="openCertModal(${index})" style="cursor: pointer;">
                        <div class="cert-img-box">
                            <img src="${c.image}" alt="${c.issuer}" class="cert-img" onerror="this.src='https://via.placeholder.com/100?text=Cert'">
                        </div>
                        <div class="cert-info">
                            <h3>${c.title}</h3>
                            <div class="cert-issuer">${c.issuer}</div>
                            <div class="cert-date">Issued ${c.date}</div>
                        </div>
                    </div>
                `).join('');
            } else if (certContainer) {
                certContainer.innerHTML = "<p>No certifications found.</p>";
            }
        }

        // --- 2.6 Fetch Blogs ---
        const blogRes = await fetch(`${API_URL}/blogs`);
        if(blogRes.ok) {
            allBlogs = await blogRes.json();
            const blogContainer = document.querySelector('.blog-grid');

            if (allBlogs.length > 0 && blogContainer) {
                blogContainer.innerHTML = allBlogs.map((b, index) => `
                    <div class="blog-card" onclick="openBlogModal(${index})">
                        <span class="blog-date">${b.date}</span>
                        <h3>${b.title}</h3>
                        <span class="blog-link">Read More &rarr;</span>
                    </div>
                `).join('');
            } else if (blogContainer) {
                blogContainer.innerHTML = "<p>No blogs posted yet.</p>";
            }
        }

    } catch (error) {
        console.error("API Error:", error);
    }
}

// =========================================
// 3. MODAL LOGIC HANDLERS
// =========================================

// --- 3.1 General Project Modal ---
const projectModal = document.getElementById('modal-overlay');

window.openModal = function(index) {
    if (!allProjects[index]) return;
    const project = allProjects[index];
    
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

// --- 3.2 Featured Project Modal ---
const featuredModal = document.getElementById('featured-modal');

window.openFeaturedModal = function(index) {
    if (!allFeatured[index] || !featuredModal) return;
    const feat = allFeatured[index];

    // মডালের টাইটেল এবং ট্যাগ আপডেট
    const modalTitle = featuredModal.querySelector('.modal-title');
    if(modalTitle) modalTitle.innerText = feat.title;

    const researchMeta = featuredModal.querySelector('.research-meta');
    if(researchMeta) researchMeta.innerHTML = `<strong>Tag:</strong> ${feat.tag}`;

    // বডি কনটেন্ট আপডেট
    const researchBody = featuredModal.querySelector('.research-body');
    if(researchBody) {
        researchBody.innerHTML = `
            <div class="research-section">
                <h4>Summary</h4>
                <p>${feat.summary}</p>
            </div>
            <div class="research-section">
                <h4>Key Metrics</h4>
                <ul>
                    <li><strong>Accuracy/Impact:</strong> ${feat.accuracy || 'N/A'}</li>
                    <li><strong>Dataset/Size:</strong> ${feat.dataset || 'N/A'}</li>
                    <li><strong>Model/Tech:</strong> ${feat.model || 'N/A'}</li>
                </ul>
            </div>
            <div class="research-links">
                <a href="${feat.githubLink || '#'}" target="_blank" class="btn-secondary" ${!feat.githubLink ? 'style="display:none"' : ''}>View on GitHub</a>
            </div>
        `;
    }

    featuredModal.style.display = 'flex';
    setTimeout(() => featuredModal.classList.add('active'), 10);
};

window.closeFeaturedModal = function() {
    if (featuredModal) {
        featuredModal.classList.remove('active');
        setTimeout(() => featuredModal.style.display = 'none', 300);
    }
};

// --- 3.3 Certification Modal ---
const certModal = document.getElementById('cert-modal');

window.openCertModal = function(index) {
    if (!allCerts[index] || !certModal) return;
    const cert = allCerts[index];

    document.getElementById('c-title').innerText = cert.title;
    document.getElementById('c-issuer').innerText = cert.issuer;
    document.getElementById('c-desc').innerText = cert.description || "Training covering core concepts.";
    document.getElementById('c-impact').innerText = cert.impact || "Applied knowledge in real-world projects.";
    
    const verifyLink = document.getElementById('c-link');
    if(verifyLink) {
        verifyLink.href = cert.credentialLink || '#';
        verifyLink.style.display = (cert.credentialLink && cert.credentialLink !== "#") ? 'inline-block' : 'none';
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

// --- 3.4 Blog Modal ---
const blogModal = document.getElementById('blog-modal');

window.openBlogModal = function(index) {
    if(!blogModal || !allBlogs[index]) return;
    const blog = allBlogs[index];
    
    document.getElementById('b-title').innerText = blog.title;
    document.getElementById('b-date').innerText = blog.date;
    document.getElementById('b-content').innerHTML = blog.content; 
    
    blogModal.style.display = 'flex';
    setTimeout(() => blogModal.classList.add('active'), 10);
}

window.closeBlogModal = function() {
    if (blogModal) {
        blogModal.classList.remove('active');
        setTimeout(() => blogModal.style.display = 'none', 300);
    }
}

// --- 3.5 General Close Handler (Close X buttons) ---
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
// 4. CONTACT FORM LOGIC
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
// 5. HAMBURGER & ADMIN SHORTCUT
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