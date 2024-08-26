const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[A-ZА-ЯЁ][a-zA-Zа-яА-ЯёЁ-]*$/; // Starts with uppercase, allows hyphens and Cyrillic chars
const passwordRegex = /^.{6,64}$/; // length between 6 and 64 chars

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
}

function showError(elementId, message) {
    document.getElementById(elementId).textContent = message;
}

function validateRegistrationForm(form) {
    let isValid = true;
    clearErrors();

    if (!form.firstName.value.trim()) {
        showError('firstNameError', 'First Name is required');
        isValid = false;
    } else if (!nameRegex.test(form.firstName.value.trim())) {
        showError('firstNameError', 'First Name must start with an uppercase letter and contain only letters and hyphens');
        isValid = false;
    }

    if (!form.lastName.value.trim()) {
        showError('lastNameError', 'Last Name is required');
        isValid = false;
    } else if (!nameRegex.test(form.lastName.value.trim())) {
        showError('lastNameError', 'Last Name must start with an uppercase letter and contain only letters and hyphens');
        isValid = false;
    }

    if (!emailRegex.test(form.email.value.trim())) {
        showError('emailError', 'Invalid email address');
        isValid = false;
    }

    if (!passwordRegex.test(form.password.value.trim())) {
        showError('passwordError', 'Password must be between 6 and 64 characters long');
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

    return isValid;
}

function validateLoginForm(form) {
    let isValid = true;
    clearErrors();

    if (!emailRegex.test(form.email.value.trim())) {
        showError('loginEmailError', 'Invalid email address');
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

    return isValid;
}

function validateNameChangeForm(data) {
    if (!nameRegex.test(data.firstName) || !nameRegex.test(data.lastName)) {
        document.getElementById('changeNameError').textContent = 'Names must start with an uppercase letter and contain only letters and hyphens';
        return false;
    }
    return true;
}

function validatePasswordChangeForm(data) {
    if (!passwordRegex.test(data.newPassword)) {
        document.getElementById('changePasswordError').textContent = 'New Password must be between 6 and 64 characters long';
        return false;
    }

    if (data.newPassword !== data.confirmNewPassword) {
        document.getElementById('changePasswordError').textContent = 'Passwords do not match';
        return false;
    }
    return true;
}
