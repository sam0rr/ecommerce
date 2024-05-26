document.addEventListener('DOMContentLoaded', () => {
    updateHeader();

    document.addEventListener('click', (event) => {
        const dropdown = document.getElementById('user-dropdown');
        const userLink = document.getElementById('user-link');

        if (dropdown.classList.contains('show') && !dropdown.contains(event.target) && event.target !== userLink) {
            dropdown.classList.remove('show');
        }
    });
});

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('user', JSON.stringify(data));
            updateHeader();
            window.location.href = 'index.html';
        } else {
            alert('Invalid username or password');
        }
    })
    .catch(err => console.error(err));
}

function updateHeader() {
    const user = JSON.parse(localStorage.getItem('user'));
    const userLink = document.getElementById('user-link');
    const dropdown = document.getElementById('user-dropdown');

    if (user) {
        userLink.innerHTML = `<span>${user.firstName}</span>`;
        userLink.href = '#';
        userLink.classList.add('user-logged-in');
        userLink.onclick = toggleDropdown;
    } else {
        userLink.innerHTML = `<i class="fas fa-user"></i>`;
        userLink.href = 'login.html';
        userLink.classList.remove('user-logged-in');
        userLink.onclick = null;
        dropdown.style.display = 'none'; 
    }
}



function toggleDropdown(event) {
    event.preventDefault();
    event.stopPropagation();

    const dropdown = document.getElementById('user-dropdown');
    dropdown.classList.toggle('show');

}

function logout(event) {
    event.preventDefault();
    localStorage.removeItem('user');
    updateHeader();
}
