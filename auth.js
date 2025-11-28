const PROXY_URL = "https://corsproxy.io/?";
const TARGET_URL = "https://ladder.vrc.bc.ca/api/login";
const VRC_LOGIN_URL = PROXY_URL + encodeURIComponent(TARGET_URL);

/**
 * Attempts to log in to the VRC API.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<boolean>} - True if login is successful, false otherwise.
 */
async function vrcLogin(email, password) {
    const payload = {
        email: email,
        password: password,
        rememberMe: false
    };

    try {
        const response = await fetch(VRC_LOGIN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log("VRC Login successful.");
            return true;
        } else {
            console.error("VRC Login failed:", response.status, await response.text());
            return false;
        }
    } catch (error) {
        console.error("Error during VRC login:", error);
        return false;
    }
}

/**
 * Shows the main content of the page.
 */
function showPageContent() {
    // Hide auth prompt if it exists
    const authContainer = document.getElementById('authContainer');
    if (authContainer) {
        authContainer.style.display = 'none';
    }
    // Show all elements that require authentication
    document.querySelectorAll('.requires-auth').forEach(el => {
        el.style.display = 'block';
    });
}

/**
 * Creates and displays a login form.
 */
function showLoginPrompt() {
    const container = document.getElementById('authContainer');
    if (!container) return;

    container.innerHTML = `
        <div class="auth-prompt">
            <h2>Authentication Required</h2>
            <p>Please log in to the VRC system to continue.</p>
            <div id="authError" class="alert alert-danger" style="display: none;"></div>
            <form id="loginForm">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary">Login</button>
            </form>
        </div>
    `;

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const authError = document.getElementById('authError');

        const loggedIn = await vrcLogin(email, password);
        if (loggedIn) {
            sessionStorage.setItem('vrc_authenticated', 'true');
            sessionStorage.setItem('vrc_email', email);
            sessionStorage.setItem('vrc_password', password);
            showPageContent();
        } else {
            authError.textContent = 'Login failed. Please check your credentials and try again.';
            authError.style.display = 'block';
            sessionStorage.removeItem('vrc_authenticated');
            sessionStorage.removeItem('vrc_email');
            sessionStorage.removeItem('vrc_password');
        }
    });
}