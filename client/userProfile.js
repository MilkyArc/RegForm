document.getElementById('changeNameForm')?.addEventListener('submit', handleChangeName);
document.getElementById('changePasswordForm')?.addEventListener('submit', handleChangePassword);

document.addEventListener('DOMContentLoaded', fetchUserDetails);

async function fetchUserDetails() {
    try {
        const response = await fetch('http://localhost:3000/user-details');
        if (!response.ok) {
            throw new Error('Failed to fetch user details');
        }
        const userDetails = await response.json();
        if (userDetails.error) {
            alert('Error: ' + userDetails.error);
            window.location.href = 'login.html';
        } else {
            document.querySelector('h1').textContent = `Welcome to Your Dashboard, ${userDetails.firstName} ${userDetails.lastName}`;
        }
    } catch (error) {
        console.error('Error fetching user details:', error);
        alert('Could not fetch user details. Please log in again.');
        window.location.href = 'login.html';
    }
}

async function handleChangeName(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    if (!validateNameChangeForm(data)) return;

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
            await fetchUserDetails();
            window.location.reload();
        }
    } catch (error) {
        console.error('Error during name change:', error);
    }
}

async function handleChangePassword(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    if (!validatePasswordChangeForm(data)) return;

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
}


document.getElementById('logoutButton')?.addEventListener('click', handleLogout);

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