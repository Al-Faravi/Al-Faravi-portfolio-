const API_URL = 'http://localhost:5000/api';

// State Variables
let currentTab = 'projects';
let isEditing = false;
let editId = null;

// =========================================
// 1. AUTHENTICATION (Server-Side Secure Check)
// =========================================

// Check session on load
if (!sessionStorage.getItem('admin_token')) {
    document.getElementById('login-overlay').style.display = 'flex';
} else {
    document.getElementById('login-overlay').style.display = 'none';
    showTab('projects');
}

async function checkLogin() {
    const pinInput = document.getElementById('admin-pass');
    const pin = pinInput.value;
    const btn = document.querySelector('#login-overlay button');
    const originalText = btn.innerText;

    // UI Loading State
    btn.innerText = "Checking...";
    btn.disabled = true;

    try {
        // Call Server API to verify PIN
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pin: pin })
        });

        const result = await res.json();

        if (result.success) {
            // Success: Save token & Enter
            sessionStorage.setItem('admin_token', 'secure_session');
            document.getElementById('login-overlay').style.display = 'none';
            showTab('projects');
        } else {
            // Error: Wrong PIN
            alert('❌ Wrong PIN! Access Denied.');
            pinInput.value = '';
        }
    } catch (error) {
        console.error("Auth Error:", error);
        alert('⚠️ Server Error. Ensure backend is running.');
    } finally {
        // Reset Button
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

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
    document.getElementById('page-title').innerText = titles[tab] || 'Manage Content';

    // Toggle Add Button (Status tab doesn't need "Add New")
    const addBtn = document.getElementById('btn-add-new');
    if (tab === 'status') addBtn.style.display = 'none';
    else addBtn.style.display = 'flex';

    // Fetch Data for the selected tab
    fetchData();
}

// =========================================
// 3. DATA FETCHING & RENDERING
// =========================================
async function fetchData() {
    const list = document.getElementById('data-list');
    list.innerHTML = `<div class="loading-spinner"><i class="fa-solid fa-circle-notch fa-spin"></i> Loading...</div>`;

    try {
        const res = await fetch(`${API_URL}/${currentTab}`);
        const data = await res.json();
        renderData(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        list.innerHTML = `<p style="color:red; text-align:center;">Failed to load data. Is server running?</p>`;
    }
}

function renderData(data) {
    const list = document.getElementById('data-list');
    list.innerHTML = '';

    // Handle Status Tab (Single Object)
    if (currentTab === 'status') {
        renderStatus(data);
        return;
    }

    // Handle Empty Lists
    if (!Array.isArray(data) || data.length === 0) {
        list.innerHTML = '<p style="text-align:center; color:#888;">No items found. Add new.</p>';
        return;
    }

    // Render Cards
    data.forEach(item => {
        // Dynamic Title/Subtitle based on tab
        let title = item.title || item.role || 'Untitled';
        let subtitle = item.company || item.issuer || item.date || '';
        
        const card = document.createElement('div');
        card.className = 'data-item';
        card.innerHTML = `
            <div class="item-info">
                <h4>${title}</h4>
                <div class="tag">${currentTab.toUpperCase()}</div>
                <p>${subtitle.substring(0, 50)}</p>
            </div>
            <div class="actions">
                <button class="btn-icon btn-edit" onclick='openForm(${JSON.stringify(item)})'>
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
    // Default values if data is empty
    const statusText = data.statusText || 'No Status Set';
    const statusColor = data.statusColor || '#ccc';

    list.innerHTML = `
        <div class="data-item" style="display:block; text-align:center; padding: 40px;">
            <h3 style="margin-bottom:20px;">Current Status on Website</h3>
            <div style="margin-bottom:20px;">
                <span style="
                    display:inline-block; 
                    padding:10px 25px; 
                    border-radius:50px; 
                    background:#fff; 
                    border:1px solid #ddd; 
                    font-weight:bold;
                    font-size: 1rem;
                ">
                    <span style="
                        display:inline-block; 
                        width:12px; height:12px; 
                        background:${statusColor}; 
                        border-radius:50%; margin-right:8px;
                    "></span>
                    ${statusText}
                </span>
            </div>
            <button class="btn-add" style="margin:0 auto;" onclick='openForm(${JSON.stringify(data)})'>
                Update Status
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
    
    // Generate Fields based on currentTab
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
        html += createTextarea('Description (What learned)', 'description', item?.description);
        html += createTextarea('Impact', 'impact', item?.impact);
    } 
    else if (currentTab === 'status') {
        html += createInput('Status Text (e.g. Available for work)', 'statusText', item?.statusText);
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
    modal.style.display = 'flex';
}

function closeForm() {
    modal.style.display = 'none';
}

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

// Initial Load
// No need to call fetchData here directly, 
// because checkLogin() or the initial session check will call showTab('projects')