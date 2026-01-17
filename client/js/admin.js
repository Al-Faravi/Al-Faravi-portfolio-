// const API_URL = 'http://localhost:5000/api';
const API_URL = '/api'; // Production Relative Path

// --- State Variables ---
let currentTab = 'projects';
let isEditing = false;
let editId = null;

// =========================================
// 1. AUTHENTICATION & INITIALIZATION
// =========================================

// Check session on load
document.addEventListener('DOMContentLoaded', () => {
    if (!sessionStorage.getItem('admin_token')) {
        document.getElementById('login-overlay').style.display = 'flex';
    } else {
        document.getElementById('login-overlay').style.display = 'none';
        showTab('projects');
    }
});

async function checkLogin() {
    const pinInput = document.getElementById('admin-pass');
    const pin = pinInput.value;
    const btn = document.querySelector('.btn-login');
    const originalContent = btn.innerHTML;

    // UI Loading State
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    btn.disabled = true;

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pin: pin })
        });

        const result = await res.json();

        if (result.success) {
            sessionStorage.setItem('admin_token', 'secure_session');
            document.getElementById('login-overlay').style.display = 'none';
            showTab('projects');
        } else {
            alert('❌ Wrong PIN! Access Denied.');
            pinInput.value = '';
        }
    } catch (error) {
        console.error("Auth Error:", error);
        alert('⚠️ Server Error. Ensure backend is running.');
    } finally {
        btn.innerHTML = originalContent;
        btn.disabled = false;
    }
}

// Allow 'Enter' key for login
document.getElementById('admin-pass')?.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') checkLogin();
});

// =========================================
// 2. TAB NAVIGATION
// =========================================
function showTab(tab) {
    currentTab = tab;
    
    // Update Sidebar UI
    document.querySelectorAll('.menu li').forEach(li => li.classList.remove('active'));
    const activeItem = document.getElementById(`nav-${tab}`);
    if (activeItem) activeItem.classList.add('active');

    // Update Header Text
    const titles = {
        'projects': 'Manage Projects',
        'blogs': 'Manage Blogs & Thoughts',
        'featured': 'Featured Spotlight',
        'experience': 'Experience Timeline',
        'certs': 'Certifications',
        'status': 'Live Status'
    };
    
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) pageTitle.innerText = titles[tab] || 'Manage Content';

    // Toggle Add Button
    const addBtn = document.getElementById('btn-add-new');
    if (addBtn) {
        addBtn.style.display = (tab === 'status') ? 'none' : 'flex';
    }

    // Mobile: Close sidebar after selection
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('active');
        document.querySelector('.sidebar-overlay').classList.remove('active');
    }

    fetchData();
}

// =========================================
// 3. DATA FETCHING & RENDERING
// =========================================
async function fetchData() {
    const list = document.getElementById('data-list');
    list.innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading Data...</p>
        </div>`;

    try {
        const res = await fetch(`${API_URL}/${currentTab}`);
        const data = await res.json();
        renderData(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        list.innerHTML = `<p style="color:var(--danger); text-align:center; margin-top:20px;">Failed to load data. Is server running?</p>`;
    }
}

function renderData(data) {
    const list = document.getElementById('data-list');
    list.innerHTML = '';

    // Handle Status Tab
    if (currentTab === 'status') {
        renderStatus(data);
        return;
    }

    // Handle Empty Lists
    if (!Array.isArray(data) || data.length === 0) {
        list.innerHTML = `
            <div style="text-align:center; padding:40px; color:var(--secondary);">
                <i class="fa-solid fa-folder-open" style="font-size:2rem; margin-bottom:10px; opacity:0.5;"></i>
                <p>No items found. Add new.</p>
            </div>`;
        return;
    }

    // Render Cards
    data.forEach(item => {
        let title = item.title || item.role || 'Untitled';
        let subtitle = item.company || item.issuer || item.date || item.summary || '';
        
        const card = document.createElement('div');
        card.className = 'data-item';
        card.innerHTML = `
            <div class="item-info">
                <div class="tag">${currentTab.toUpperCase()}</div>
                <h4>${title}</h4>
                <p>${subtitle.substring(0, 60)}${subtitle.length > 60 ? '...' : ''}</p>
            </div>
            <div class="actions">
                <button class="btn-icon btn-edit" onclick='openForm(${JSON.stringify(item).replace(/'/g, "&apos;")})'>
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="btn-icon btn-delete" onclick="deleteItem('${item._id}')">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        list.appendChild(card);
    });
}

function renderStatus(data) {
    const list = document.getElementById('data-list');
    const statusText = data.statusText || 'No Status Set';
    const statusColor = data.statusColor || '#ccc';

    list.innerHTML = `
        <div class="data-item" style="display:flex; flex-direction:column; align-items:center; text-align:center; padding: 40px; gap:20px;">
            <h3>Current Website Status</h3>
            
            <div style="display:flex; align-items:center; gap:10px; padding:10px 20px; border:1px solid var(--border); border-radius:50px; background:#FFF;">
                <span style="width:12px; height:12px; background:${statusColor}; border-radius:50%; box-shadow: 0 0 5px ${statusColor};"></span>
                <span style="font-weight:600; color:var(--primary);">${statusText}</span>
            </div>

            <button class="btn-add" onclick='openForm(${JSON.stringify(data)})'>
                <i class="fa-solid fa-pen"></i> Update Status
            </button>
        </div>
    `;
}

// =========================================
// 4. FORM HANDLING (Dynamic Fields)
// =========================================
const modal = document.getElementById('form-modal');
const formFields = document.getElementById('form-fields');

function openForm(item = null) {
    isEditing = !!item;
    editId = item ? item._id : null;
    
    document.getElementById('form-title').innerText = isEditing ? 'Edit Item' : 'Add New Item';
    
    let html = '';
    
    if (currentTab === 'projects') {
        html += createInput('Project Title', 'title', item?.title);
        html += createInput('Category (e.g. Web Dev)', 'category', item?.category);
        html += createTextarea('Description', 'description', item?.description);
        html += createInput('Tech Stack (comma separated)', 'techStack', item?.techStack);
        html += createInput('Live Link', 'liveLink', item?.liveLink);
        html += createInput('GitHub Link', 'githubLink', item?.githubLink);
    } 
    else if (currentTab === 'featured') {
        html += createInput('Project Title', 'title', item?.title);
        html += createInput('Tag (e.g. Research)', 'tag', item?.tag);
        html += createTextarea('Summary', 'summary', item?.summary);
        html += createInput('Accuracy Stat (e.g. 96%)', 'accuracy', item?.accuracy);
        html += createInput('Dataset Stat', 'dataset', item?.dataset);
        html += createInput('Model Name', 'model', item?.model);
        html += createInput('Image URL', 'image', item?.image);
        html += createInput('GitHub Link', 'githubLink', item?.githubLink);
    }
    else if (currentTab === 'blogs') {
        html += createInput('Blog Title', 'title', item?.title);
        html += createInput('Date (e.g. Jan 10, 2026)', 'date', item?.date);
        html += createTextarea('Content (supports HTML)', 'content', item?.content);
    }
    else if (currentTab === 'experience') {
        html += createInput('Role / Position', 'role', item?.role);
        html += createInput('Company Name', 'company', item?.company);
        html += createInput('Duration', 'duration', item?.duration);
    } 
    else if (currentTab === 'certs') {
        html += createInput('Certification Title', 'title', item?.title);
        html += createInput('Issuer (e.g. Coursera)', 'issuer', item?.issuer);
        html += createInput('Date Issued', 'date', item?.date);
        html += createInput('Image URL', 'image', item?.image);
        html += createInput('Credential Link', 'credentialLink', item?.credentialLink);
        html += createTextarea('Description', 'description', item?.description);
        html += createTextarea('Impact', 'impact', item?.impact);
    } 
    else if (currentTab === 'status') {
        html += createInput('Status Text', 'statusText', item?.statusText);
        html += `
            <div class="input-group">
                <label>Status Color</label>
                <select name="statusColor">
                    <option value="#10B981" ${item?.statusColor === '#10B981' ? 'selected' : ''}>Green (Available)</option>
                    <option value="#EF4444" ${item?.statusColor === '#EF4444' ? 'selected' : ''}>Red (Busy)</option>
                    <option value="#F59E0B" ${item?.statusColor === '#F59E0B' ? 'selected' : ''}>Yellow (Away)</option>
                </select>
            </div>
        `;
    }

    formFields.innerHTML = html;
    modal.classList.add('active'); // Changed display:flex to class active for CSS animation
    modal.style.display = 'flex';
}

function closeForm() {
    modal.classList.remove('active');
    setTimeout(() => { modal.style.display = 'none'; }, 200);
}

// Close modal on outside click
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeForm();
});

// Helpers
function createInput(label, name, value = '') {
    return `
        <div class="input-group">
            <label>${label}</label>
            <input type="text" name="${name}" value="${value || ''}" required>
        </div>
    `;
}

function createTextarea(label, name, value = '') {
    return `
        <div class="input-group">
            <label>${label}</label>
            <textarea name="${name}" rows="4" required>${value || ''}</textarea>
        </div>
    `;
}

// =========================================
// 5. SUBMIT DATA (Create / Update)
// =========================================
document.getElementById('admin-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
    submitBtn.disabled = true;

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Tech Stack array conversion
    if (currentTab === 'projects' && data.techStack) {
        data.techStack = data.techStack.split(',').map(t => t.trim());
    }

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${API_URL}/${currentTab}/${editId}` : `${API_URL}/${currentTab}`;

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            closeForm();
            fetchData(); // Reload list
        } else {
            alert('Error saving data');
        }
    } catch (error) {
        console.error(error);
        alert('Server Error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// =========================================
// 6. DELETE ITEM
// =========================================
async function deleteItem(id) {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
        const res = await fetch(`${API_URL}/${currentTab}/${id}`, {
            method: 'DELETE'
        });

        if (res.ok) {
            fetchData();
        } else {
            alert('Failed to delete');
        }
    } catch (error) {
        console.error(error);
        alert('Error deleting');
    }
}