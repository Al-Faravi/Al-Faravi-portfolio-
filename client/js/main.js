// const API_URL = 'http://localhost:5000/api';
const API_URL = '/api'; // Vercel Deployment Relative Path

// --- GLOBAL VARIABLES (Data Storage) ---
let allProjects = [];
let allCerts = [];
let allBlogs = [];
let allFeatured = []; 

// =========================================
// 1. SLIDER CONTROLS
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
// 2. DATA FETCHING & RENDERING (Robust Error Handling)
// =========================================
async function fetchData() {
    try {
        console.log("Fetching data...");

        // --- 2.1 Fetch Status ---
        try {
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
        } catch (err) { console.warn("Status fetch failed", err); }

        // --- 2.2 Fetch Projects ---
        const projContainer = document.getElementById('project-grid');
        try {
            const projRes = await fetch(`${API_URL}/projects`);
            if(projRes.ok) {
                allProjects = await projRes.json();
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
                    projContainer.innerHTML = "<p>No projects found.</p>";
                }
            } else { throw new Error("Failed to fetch projects"); }
        } catch (err) {
            if(projContainer) projContainer.innerHTML = "<p style='color:red;'>Could not load projects. Server might be sleeping.</p>";
            console.error(err);
        }

        // --- 2.3 Fetch Featured Spotlight ---
        const sliderContainer = document.getElementById('featured-slider');
        try {
            const featRes = await fetch(`${API_URL}/featured`);
            if(featRes.ok) {
                allFeatured = await featRes.json();
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
                                <img src="${f.image}" onerror="this.src='https://placehold.co/600x400?text=Featured'" alt="${f.title}">
                            </div>
                        </div>
                    `).join('');
                } else if (sliderContainer) {
                    sliderContainer.innerHTML = "<p style='text-align:center; width:100%;'>No featured items yet.</p>";
                }
            } else { throw new Error("Failed to fetch featured"); }
        } catch (err) {
            if(sliderContainer) sliderContainer.innerHTML = "<p style='text-align:center;'>Could not load featured section.</p>";
        }

        // --- 2.4 Fetch Experience ---
        const expContainer = document.getElementById('experience-list');
        try {
            const expRes = await fetch(`${API_URL}/experience`);
            if(expRes.ok) {
                const experiences = await expRes.json();
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
        } catch (err) {
            if(expContainer) expContainer.innerHTML = "<p>Experience data unavailable.</p>";
        }

        // --- 2.5 Fetch Certifications ---
        const certContainer = document.getElementById('cert-grid');
        try {
            const certRes = await fetch(`${API_URL}/certs`);
            if(certRes.ok) {
                allCerts = await certRes.json();
                if (allCerts.length > 0 && certContainer) {
                    certContainer.innerHTML = allCerts.map((c, index) => `
                        <div class="cert-card" onclick="openCertModal(${index})" style="cursor: pointer;">
                            <div class="cert-img-box">
                                <img src="${c.image}" alt="${c.issuer}" class="cert-img" onerror="this.src='https://placehold.co/100?text=Cert'">
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
        } catch (err) {
            if(certContainer) certContainer.innerHTML = "<p>Could not load certifications.</p>";
        }

        // --- 2.6 Fetch Blogs ---
        const blogContainer = document.querySelector('.blog-grid');
        try {
            const blogRes = await fetch(`${API_URL}/blogs`);
            if(blogRes.ok) {
                allBlogs = await blogRes.json();
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
        } catch (err) {
            if(blogContainer) blogContainer.innerHTML = "<p>Blog section unavailable.</p>";
        }

    } catch (error) {
        console.error("Global API Error:", error);
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

    const modalTitle = featuredModal.querySelector('.modal-title');
    if(modalTitle) modalTitle.innerText = feat.title;

    const researchMeta = featuredModal.querySelector('.research-meta');
    if(researchMeta) researchMeta.innerHTML = `<strong>Tag:</strong> ${feat.tag}`;

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

// =========================================
// 6. SMART LIVE CLOCK, DATE & GEOLOCATION WEATHER (NEW)
// =========================================

// --- A. Time & Date (Browser's Local Time) ---
function updateLiveWidget() {
    const liveTime = document.getElementById('live-time');
    const liveDate = document.getElementById('live-date');
    if (!liveTime) return; // Guard clause if widget not present

    const now = new Date();
    
    // Time Setup
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    
    liveTime.innerText = `${hours}:${minutes} ${ampm}`;

    // Date Setup
    const options = { month: 'short', day: 'numeric', weekday: 'short' };
    if (liveDate) liveDate.innerText = now.toLocaleDateString('en-US', options);
}
setInterval(updateLiveWidget, 1000);
updateLiveWidget();

// --- B. Weather (Geolocation Based) ---
const WEATHER_API_KEY = 'b140d4764e7e30ec785c37515da8ea5d';

async function getWeatherData(lat, lon) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.main) {
            updateWeatherUI(data);
        }
    } catch (error) {
        console.error("Weather API Error:", error);
        const locEl = document.getElementById('live-location');
        if(locEl) locEl.innerText = "Offline";
    }
}

// Fallback to Dhaka
async function getDefaultWeather() {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=Dhaka&units=metric&appid=${WEATHER_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        updateWeatherUI(data);
    } catch (err) { console.error(err); }
}

function updateWeatherUI(data) {
    // 1. Temp
    const tempEl = document.getElementById('live-temp');
    if(tempEl) tempEl.innerText = `${Math.round(data.main.temp)}°C`;

    // 2. Location Name
    const locEl = document.getElementById('live-location');
    if(locEl) locEl.innerText = data.name;

    // 3. Icon Logic
    const weatherIcon = document.getElementById('weather-icon');
    if (weatherIcon && data.weather && data.weather.length > 0) {
        const main = data.weather[0].main.toLowerCase();
        weatherIcon.className = ''; // Reset
        
        if(main.includes('cloud')) weatherIcon.className = "fa-solid fa-cloud";
        else if(main.includes('rain')) weatherIcon.className = "fa-solid fa-cloud-showers-heavy";
        else if(main.includes('clear')) weatherIcon.className = "fa-solid fa-sun";
        else if(main.includes('snow')) weatherIcon.className = "fa-regular fa-snowflake";
        else if(main.includes('mist') || main.includes('haze')) weatherIcon.className = "fa-solid fa-smog";
        else weatherIcon.className = "fa-solid fa-cloud-sun";
    }
}

// --- C. Initialize Location ---
function initWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                getWeatherData(latitude, longitude);
            },
            (error) => {
                console.warn("Location denied. Showing Default.");
                getDefaultWeather();
            }
        );
    } else {
        getDefaultWeather();
    }
}

// INITIALIZE
document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    initWeather();
});