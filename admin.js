/* ============================================
   Admin Dashboard — JavaScript
   Google Sign-In + Data Fetching
   ============================================ */

(() => {
    // ========== CONFIGURATION ==========
    // *** PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE (same one from index.js) ***
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyXNFSutaJXPgwuZrFXj3BC9ksdG_CQ7g8u2Ozkvzbs5p0Ay9STjBAMmLwjrEWpYkEE/exec';

    // Authorized admin credentials
    const ADMIN_USER = 'Manohar07';
    const ADMIN_PASS = 'Shanaya16';
    const ADMIN_EMAIL = 'Manoharansiddarth@gmail.com'; // used for fetching via apps script token

    // ========== STATE ==========
    let allContacts = [];
    let currentUser = null;

    // ========== DOM REFS ==========
    const loginScreen = document.getElementById('loginScreen');
    const dashboard = document.getElementById('dashboard');
    const loginError = document.getElementById('loginError');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminUsernameInput = document.getElementById('adminUsername');
    const adminPasswordInput = document.getElementById('adminPassword');

    const logoutBtn = document.getElementById('logoutBtn');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const searchInput = document.getElementById('searchInput');

    // Stat elements
    const totalContactsEl = document.getElementById('totalContacts');
    const monthContactsEl = document.getElementById('monthContacts');
    const latestContactEl = document.getElementById('latestContact');
    const avgPerMonthEl = document.getElementById('avgPerMonth');

    // Table elements
    const tableLoading = document.getElementById('tableLoading');
    const contactsTable = document.getElementById('contactsTable');
    const contactsBody = document.getElementById('contactsBody');
    const emptyState = document.getElementById('emptyState');

    // ========== LOCAL SIGN-IN ==========

    function initLocalSignIn() {
        // Check for existing session
        const savedUser = sessionStorage.getItem('adminUser');
        if (savedUser) {
            try {
                currentUser = JSON.parse(savedUser);
                if (currentUser.username === ADMIN_USER) {
                    showDashboard();
                    return;
                }
            } catch (e) {
                sessionStorage.removeItem('adminUser');
            }
        }

        // Handle login form submission
        if (adminLoginForm) {
            adminLoginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                loginError.textContent = '';

                const enteredUser = adminUsernameInput.value.trim();
                const enteredPass = adminPasswordInput.value.trim();

                if (enteredUser === ADMIN_USER && enteredPass === ADMIN_PASS) {
                    // Success — save user info
                    currentUser = {
                        name: 'Manohar',
                        username: ADMIN_USER,
                        picture: 'profile.jpg' // Use the same profile picture
                    };

                    sessionStorage.setItem('adminUser', JSON.stringify(currentUser));
                    showDashboard();
                } else {
                    loginError.textContent = 'Invalid username or password.';
                }
            });
        }
    }

    // ========== DASHBOARD ==========

    function showDashboard() {
        loginScreen.style.display = 'none';
        dashboard.style.display = 'block';

        // Set user info
        userAvatar.src = currentUser.picture || '';
        userName.textContent = currentUser.name || currentUser.email;

        // Fetch data
        fetchContactData();
    }

    async function fetchContactData() {
        tableLoading.style.display = 'flex';
        contactsTable.style.display = 'none';
        emptyState.style.display = 'none';

        // Check if script URL is configured
        if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
            tableLoading.style.display = 'none';
            emptyState.style.display = 'block';
            emptyState.querySelector('p').textContent = '⚠️ Google Apps Script URL not configured. Please set GOOGLE_SCRIPT_URL in admin.js';
            totalContactsEl.textContent = '0';
            monthContactsEl.textContent = '0';
            latestContactEl.textContent = 'N/A';
            avgPerMonthEl.textContent = '0';
            return;
        }

        try {
            const url = `${GOOGLE_SCRIPT_URL}?token=${encodeURIComponent(ADMIN_EMAIL)}`;
            const response = await fetch(url);
            const result = await response.json();

            if (result.status === 'success') {
                allContacts = result.data || [];
                renderStats();
                renderTable(allContacts);
            } else {
                throw new Error(result.message || 'Failed to fetch data');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            tableLoading.style.display = 'none';
            emptyState.style.display = 'block';
            emptyState.querySelector('p').textContent = `Error loading data: ${error.message}`;
        }
    }

    function renderStats() {
        const total = allContacts.length;
        totalContactsEl.textContent = total;

        // This month
        const now = new Date();
        const thisMonth = allContacts.filter(c => {
            try {
                const d = new Date(c.timestamp);
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            } catch { return false; }
        });
        monthContactsEl.textContent = thisMonth.length;

        // Latest contact
        if (total > 0) {
            const latest = allContacts[allContacts.length - 1];
            const latestName = latest.name || 'Unknown';
            latestContactEl.textContent = latestName;
        } else {
            latestContactEl.textContent = 'N/A';
        }

        // Average per month
        if (total > 0) {
            try {
                const timestamps = allContacts.map(c => new Date(c.timestamp)).filter(d => !isNaN(d));
                if (timestamps.length > 0) {
                    const earliest = new Date(Math.min(...timestamps));
                    const months = Math.max(1, (now.getFullYear() - earliest.getFullYear()) * 12 + now.getMonth() - earliest.getMonth() + 1);
                    avgPerMonthEl.textContent = Math.round(total / months * 10) / 10;
                } else {
                    avgPerMonthEl.textContent = total;
                }
            } catch {
                avgPerMonthEl.textContent = total;
            }
        } else {
            avgPerMonthEl.textContent = '0';
        }
    }

    function renderTable(contacts) {
        tableLoading.style.display = 'none';

        if (contacts.length === 0) {
            contactsTable.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        contactsTable.style.display = 'table';
        emptyState.style.display = 'none';

        // Reverse to show newest first
        const reversed = [...contacts].reverse();

        contactsBody.innerHTML = reversed.map((c, i) => `
            <tr>
                <td>${contacts.length - i}</td>
                <td>${escapeHtml(c.timestamp || '—')}</td>
                <td class="td-name">${escapeHtml(c.name || '—')}</td>
                <td class="td-email"><a href="mailto:${escapeHtml(c.email || '')}">${escapeHtml(c.email || '—')}</a></td>
                <td>${escapeHtml(c.subject || '—')}</td>
                <td title="${escapeHtml(c.message || '')}">${escapeHtml(truncate(c.message || '—', 80))}</td>
            </tr>
        `).join('');
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function truncate(str, max) {
        return str.length > max ? str.substring(0, max) + '…' : str;
    }

    // ========== SEARCH ==========
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (!query) {
                renderTable(allContacts);
                return;
            }
            const filtered = allContacts.filter(c =>
                (c.name && c.name.toLowerCase().includes(query)) ||
                (c.email && c.email.toLowerCase().includes(query)) ||
                (c.subject && c.subject.toLowerCase().includes(query)) ||
                (c.message && c.message.toLowerCase().includes(query))
            );
            renderTable(filtered);
        });
    }

    // ========== LOGOUT ==========
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('adminUser');
            currentUser = null;
            allContacts = [];
            dashboard.style.display = 'none';
            loginScreen.style.display = 'flex';
            loginError.textContent = '';
        });
    }

    // ========== INIT ==========
    initLocalSignIn();
})();
