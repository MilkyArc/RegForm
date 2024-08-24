document.getElementById('changeNameForm')?.addEventListener('submit', handleChangeName);
document.getElementById('changePasswordForm')?.addEventListener('submit', handleChangePassword);

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
            alert('Name changed successfully!');
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