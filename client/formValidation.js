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
    } else if (form.firstName.value.trim().length < 2) {
        showError('firstNameError', 'First Name must be at least 2 characters long');
        isValid = false;
    }

    if (!form.lastName.value.trim()) {
        showError('lastNameError', 'Last Name is required');
        isValid = false;
    } else if (form.lastName.value.trim().length < 2) {
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

    return isValid;
}

function validateLoginForm(form) {
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

    return isValid;
}


function validateNameChangeForm(data) {
    if (data.firstName.length < 2 || data.lastName.length < 2) {
        document.getElementById('changeNameError').textContent = 'Names must be at least 2 characters long';
        return false;
    }
    return true;
}


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
