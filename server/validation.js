function validateRegistrationData(data, callback) {
  const { email, firstName, lastName, password, confirmPassword } = data;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
      return callback(new Error('Invalid email format'));
  }

  if (!firstName || firstName.trim().length < 2) {
      return callback(new Error('First name must be at least 2 characters long'));
  }

  if (!lastName || lastName.trim().length < 2) {
      return callback(new Error('Last name must be at least 2 characters long'));
  }

  if (!password || password.length < 6) {
      return callback(new Error('Password must be at least 6 characters long'));
  }

  if (password !== confirmPassword) {
      return callback(new Error('Passwords do not match'));
  }

  callback(null, true);
}

function validateNameChangeData(data, callback) {
  if (data.firstName.trim().length < 2 || data.lastName.trim().length < 2) {
      return callback(new Error('Names must be at least 2 characters long'));
  }
  callback(null, true);
}

function validatePasswordChangeData(data, callback) {
  if (data.newPassword.length < 6) {
      return callback(new Error('New Password must be at least 6 characters long'));
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
