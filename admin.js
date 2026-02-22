/* ============================================
   Admin Dashboard — JavaScript
   Google Sign-In + Data Fetching
   ============================================ */

(() => {
    // ========== CONFIGURATION ==========
    // *** PASTE YOUR GOOGLE CLIENT ID HERE ***
    // Get it from: https://console.cloud.google.com → APIs & Services → Credentials → OAuth 2.0 Client IDs
    const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE';

    // *** PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE (same one from index.js) ***
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyXNFSutaJXPgwuZrFXj3BC9ksdG_CQ7g8u2Ozkvzbs5p0Ay9STjBAMmLwjrEWpYkEE/exec';

    // Authorized admin email
    const ADMIN_EMAIL = 'Manoharansiddarth@gmail.com';

    // ========== STATE ==========
    let allContacts = [];
    let currentUser = null;

    // ========== DOM REFS ==========
    const loginScreen = document.getElementById('loginScreen');
    const dashboard = document.getElementById('dashboard');
    const loginError = document.getElementById('loginError');
    const googleSignInBtn = document.getElementById('googleSignInBtn');
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

    // ========== GOOGLE SIGN-IN ==========

    // Wait for Google Identity Services library to load
    function initGoogleSignIn() {
        if (typeof google === 'undefined' || !google.accounts) {
            setTimeout(initGoogleSignIn, 200);
            return;
        }

        // Check for existing session
        const savedUser = sessionStorage.getItem('adminUser');
        if (savedUser) {
            try {
                currentUser = JSON.parse(savedUser);
                if (currentUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
                    showDashboard();
                    return;
                }
            } catch (e) {
                sessionStorage.removeItem('adminUser');
            }
        }

        // Initialize Google Sign-In
        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
            auto_select: false,
        });

        // Custom button click handler
        googleSignInBtn.addEventListener('click', () => {
            loginError.textContent = '';
            google.accounts.id.prompt((notification) => {
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                    // Fallback: render the Google button in a hidden div and trigger it
                    const tempDiv = document.createElement('div');
                    tempDiv.style.position = 'fixed';
                    tempDiv.style.top = '50%';
                    tempDiv.style.left = '50%';
                    tempDiv.style.transform = 'translate(-50%, -50%)';
                    tempDiv.style.zIndex = '99999';
                    tempDiv.style.background = 'rgba(17, 24, 39, 0.95)';
                    tempDiv.style.padding = '2rem';
                    tempDiv.style.borderRadius = '1rem';
                    tempDiv.style.border = '1px solid rgba(255,255,255,0.1)';
                    tempDiv.id = 'googlePopupFallback';

                    const closeBtn = document.createElement('button');
                    closeBtn.textContent = '✕ Close';
                    closeBtn.style.cssText = 'display:block;margin:1rem auto 0;background:none;border:1px solid rgba(255,255,255,0.2);color:#94a3b8;padding:8px 16px;border-radius:20px;cursor:pointer;font-size:0.8rem;';
                    closeBtn.onclick = () => tempDiv.remove();

                    document.body.appendChild(tempDiv);

                    google.accounts.id.renderButton(tempDiv, {
                        theme: 'filled_blue',
                        size: 'large',
                        width: 300,
                        text: 'signin_with',
                    });

                    tempDiv.appendChild(closeBtn);
                }
            });
        });
    }

    function handleCredentialResponse(response) {
        // Remove fallback popup if present
        const popup = document.getElementById('googlePopupFallback');
        if (popup) popup.remove();

        // Decode JWT token
        const payload = decodeJWT(response.credential);

        if (!payload) {
            loginError.textContent = 'Failed to decode credentials. Please try again.';
            return;
        }

        if (payload.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
            loginError.textContent = `Access denied. ${payload.email} is not authorized.`;
            return;
        }

        // Success — save user info
        currentUser = {
            name: payload.name,
            email: payload.email,
            picture: payload.picture,
        };

        sessionStorage.setItem('adminUser', JSON.stringify(currentUser));
        showDashboard();
    }

    function decodeJWT(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64).split('').map(c =>
                    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                ).join('')
            );
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
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
    initGoogleSignIn();
})();
