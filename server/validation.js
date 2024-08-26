const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[A-ZА-ЯЁ][a-zA-Zа-яА-ЯёЁ-]*$/; // Must Start with uppercase, allows hyphens and Cyrillic chars
const passwordRegex = /^.{6,64}$/; // Password length must be between 6 and 64 characters

function validateRegistrationData(data, callback) {
    const { email, firstName, lastName, password, confirmPassword } = data;

    if (!email || !emailRegex.test(email)) {
        return callback(new Error('Invalid email format'));
    }

    if (!firstName || !nameRegex.test(firstName)) {
        return callback(new Error('First name must start with an uppercase letter and contain only letters and hyphens'));
    }

    if (!lastName || !nameRegex.test(lastName)) {
        return callback(new Error('Last name must start with an uppercase letter and contain only letters and hyphens'));
    }

    if (!password || !passwordRegex.test(password)) {
        return callback(new Error('Password must be between 6 and 64 characters long'));
    }

    if (password !== confirmPassword) {
        return callback(new Error('Passwords do not match'));
    }

    callback(null, true);
}

function validateNameChangeData(data, callback) {
    if (!nameRegex.test(data.firstName) || !nameRegex.test(data.lastName)) {
        return callback(new Error('Names must start with an uppercase letter and contain only letters and hyphens'));
    }
    callback(null, true);
}

function validatePasswordChangeData(data, callback) {
    if (!passwordRegex.test(data.newPassword)) {
        return callback(new Error('New Password must be between 6 and 64 characters long'));
    }

    if (data.newPassword !== data.confirmNewPassword) {
        return callback(new Error('Passwords do not match'));
    }

    callback(null, true);
}

module.exports = {
    validateRegistrationData,
    validateNameChangeData,
    validatePasswordChangeData
};
