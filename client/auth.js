// auth.js

document.getElementById('registerForm')?.addEventListener('submit', handleRegister);
document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
document.getElementById('logoutButton')?.addEventListener('click', handleLogout);

async function handleRegister(e) {
    e.preventDefault(); // Prevent the default form submission
    const form = e.target;

    if (!validateRegistrationForm(form)) return;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData); // Converts FormData to a plain object

    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Ensure JSON format
            },
            body: JSON.stringify(data), // Stringify data for JSON format
        });

        const result = await response.json();

        if (result.error) {
            alert(result.error);
            window.location.reload();
        } else if (result.message) {
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Error during registration:', error);
    }
}

async function handleLogin(e) {
    e.preventDefault(); // Prevent the default form submission
    const form = e.target;

    if (!validateLoginForm(form)) return;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData); // Convert form data to a plain object

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Ensure JSON format
            },
            body: JSON.stringify(data), // Convert the data object to JSON string
        });

        const result = await response.json();

        if (result.error) {
            alert(result.error);
            window.location.reload();
        } else if (result.message) {
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
}

async function handleLogout() {
    try {
        const response = await fetch('http://localhost:3000/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();

        if (result.error) {
            alert(result.error);
        } else if (result.message) {
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Error during logout:', error);
    }
}
