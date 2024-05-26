function getUserFromLocalStorage() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user;
}

function updateAccountLink() {
    const user = getUserFromLocalStorage();
    const accountImg = document.getElementById('user-img');

    if (user && user.image) {
        accountImg.src = user.image;
    }
}

function updatePlaceholder() {
    const user = getUserFromLocalStorage();
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const usernameInput = document.getElementById('userName');
    const emailInput = document.getElementById('email');

    if (user) {
        if (user.firstName && firstNameInput) {
            firstNameInput.value = user.firstName;
            firstNameInput.placeholder = `${user.firstName}`;
        }

        if (user.lastName && lastNameInput) {
            lastNameInput.value = user.lastName;
            lastNameInput.placeholder = `${user.lastName}`;
        }

        if (user.username && usernameInput) {
            usernameInput.value = user.username;
            usernameInput.placeholder = `${user.username}`;
        }

        if (user.email && emailInput) {
            emailInput.value = user.email;
            emailInput.placeholder = `${user.email}`;
        }
    }
}

function redirectToIndex() {
    window.location.href = 'index.html';
}

function updateUserInLocalStorage() {
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const usernameInput = document.getElementById('userName');
    const emailInput = document.getElementById('email');

    const updatedUser = {
        firstName: firstNameInput.value,
        lastName: lastNameInput.value,
        username: usernameInput.value,
        email: emailInput.value,
        image: getUserFromLocalStorage().image
    };

    localStorage.setItem('user', JSON.stringify(updatedUser));
    showSuccessBox(); // Display success message
    location.reload(); // Refresh the page
}

function showSuccessBox() {
    document.getElementById('success-box').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    updateAccountLink();
    updatePlaceholder();

    const updateButton = document.getElementById('updateButton');
    if (updateButton) {
        updateButton.addEventListener('click', updateUserInLocalStorage);
    }
});
