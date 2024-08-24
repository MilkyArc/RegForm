// Utility functions for inline validation
function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
}

function showError(elementId, message) {
    document.getElementById(elementId).textContent = message;
}

// Validate registration form data
function validateRegistrationForm(form) {
    let isValid = true;
    clearErrors();

    // Validate first name
    if (!form.firstName.value.trim()) {
        showError('firstNameError', 'First Name is required');
        isValid = false;
    } else if (form.firstName.value.trim().length < 2) {
        showError('firstNameError', 'First Name must be at least 2 characters long');
        isValid = false;
    }

    // Validate last name
    if (!form.lastName.value.trim()) {
        showError('lastNameError', 'Last Name is required');
        isValid = false;
    } else if (form.lastName.value.trim().length < 2) {
        showError('lastNameError', 'Last Name must be at least 2 characters long');
        isValid = false;
    }

    // Validate email
    if (!form.email.validity.valid) {
        showError('emailError', 'Invalid email address');
        isValid = false;
    }

    // Validate password
    if (!form.password.validity.valid || form.password.value.trim().length < 6) {
        showError('passwordError', 'Password must be at least 6 characters long');
        isValid = false;
    }

    // Validate confirm password
    if (form.password.value !== form.confirmPassword.value) {
        showError('confirmPasswordError', 'Passwords do not match');
        isValid = false;
    }

    // Validate CAPTCHA response
    if (!form.captchaResponse.value.trim()) {
        showError('captchaError', 'Captcha is required');
        isValid = false;
    }

    return isValid;
}

// Validate login form data
function validateLoginForm(form) {
    let isValid = true;
    clearErrors();

    // Validate email
    if (!form.email.validity.valid || !form.email.value.trim()) {
        showError('loginEmailError', 'Email is required');
        isValid = false;
    }

    // Validate password
    if (!form.password.value.trim()) {
        showError('loginPasswordError', 'Password is required');
        isValid = false;
    }

    // Validate CAPTCHA response
    if (!form.captchaResponse.value.trim()) {
        showError('captchaError', 'Captcha is required');
        isValid = false;
    }

    return isValid;
}

// Validate name change form data
function validateNameChangeForm(data) {
    if (data.firstName.length < 2 || data.lastName.length < 2) {
        document.getElementById('changeNameError').textContent = 'Names must be at least 2 characters long';
        return false;
    }
    return true;
}

// Validate password change form data
function validatePasswordChangeForm(data) {
    if (data.newPassword !== data.confirmNewPassword) {
        document.getElementById('changePasswordError').textContent = 'Passwords do not match';
        return false;
    }

    if (data.newPassword.length < 6) {
        document.getElementById('changePasswordError').textContent = 'New Password must be at least 6 characters long';
        return false;
    }
    return true;
}
