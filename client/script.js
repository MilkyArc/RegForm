
document.addEventListener('DOMContentLoaded', loadCaptcha);


async function loadCaptcha() {
    try {
        const response = await fetch('http://localhost:3000/captcha');
        if (!response.ok) {
            throw new Error('Failed to load CAPTCHA');
        }
        const result = await response.json();
        const captchaQuestionElement = document.getElementById('captchaQuestion');
        captchaQuestionElement.innerText = result.question;
        captchaQuestionElement.style.userSelect = "none"; 
    } catch (error) {
        console.error('Error loading CAPTCHA:', error);
        document.getElementById('captchaQuestion').innerText = 'Failed to load CAPTCHA';
    }
}


function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
}

function showError(elementId, message) {
    document.getElementById(elementId).textContent = message;
}


document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const form = e.target;
    let isValid = true;

    clearErrors();

    if (!form.firstName.value.trim()) {
        showError('firstNameError', 'First Name is required');
        isValid = false;
    }

    if (form.firstName.value.trim().length < 2) {
        showError('firstNameError', 'First Name must be at least 2 characters long');
        isValid = false;
    }

    if (!form.lastName.value.trim()) {
        showError('lastNameError', 'Last Name is required');
        isValid = false;
    }

    if (form.lastName.value.trim().length < 2) {
        showError('lastNameError', 'Last Name must be at least 2 characters long');
        isValid = false;
    }

    if (!form.email.validity.valid) {
        showError('emailError', 'Invalid email address');
        isValid = false;
    }

    if (!form.password.validity.valid || form.password.value.trim().length < 6) {
        showError('passwordError', 'Password must be at least 6 characters long');
        isValid = false;
    }

    if (form.password.value !== form.confirmPassword.value) {
        showError('confirmPasswordError', 'Passwords do not match');
        isValid = false;
    }

    if (!form.captchaResponse.value.trim()) {
        showError('captchaError', 'Captcha is required');
        isValid = false;
    }

    if (!isValid) {
        return; 
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData); 

    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(data), 
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
});


document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault(); on

    const form = e.target;
    let isValid = true;

    clearErrors();

    if (!form.email.validity.valid || !form.email.value.trim()) {
        showError('loginEmailError', 'Email is required');
        isValid = false;
    }

    if (!form.password.value.trim()) {
        showError('loginPasswordError', 'Password is required');
        isValid = false;
    }

    if (!form.captchaResponse.value.trim()) {
        showError('captchaError', 'Captcha is required');
        isValid = false;
    }

    if (!isValid) {
        return; 
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(data), 
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
});


document.getElementById('logoutButton')?.addEventListener('click', async () => {
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
});

document.getElementById('changeNameForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    if (data.firstName.length < 2 || data.lastName.length < 2) {
        document.getElementById('changeNameError').textContent = 'Names must be at least 2 characters long';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/change-name', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (result.error) {
            document.getElementById('changeNameError').textContent = result.error;
        } else {
            alert('Name changed successfully!');
            window.location.reload();
        }
    } catch (error) {
        console.error('Error during name change:', error);
    }
});


document.getElementById('changePasswordForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    if (data.newPassword !== data.confirmNewPassword) {
        document.getElementById('changePasswordError').textContent = 'Passwords do not match';
        return;
    }

    if (data.newPassword.length < 6) {
        document.getElementById('changePasswordError').textContent = 'New Password must be at least 6 characters long';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (result.error) {
            document.getElementById('changePasswordError').textContent = result.error;
        } else {
            alert('Password changed successfully!');
            window.location.reload();
        }
    } catch (error) {
        console.error('Error during password change:', error);
    }
});
