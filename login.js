const DEPLOY_URL = 'https://script.google.com/macros/s/AKfycbxIELE1XXJEzgFrid1h7PQbIAgKmRp-J2ESxzqUcoXwceDXEye0Wexlu2MF_qmjuXgtfQ/exec';
const loginForm = document.getElementById('loginForm');
const messageDiv = document.getElementById('message');

if (localStorage.getItem('loan_email')) {
    window.location.href = 'index.html';
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    messageDiv.textContent = '';

    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(`${DEPLOY_URL}?action=login`, {
            method: 'POST',
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            localStorage.setItem('loan_email', result.email);
            alert('Login successful!');
            window.location.href = 'index.html';
        } else {
            messageDiv.textContent = result.message || 'Invalid credentials';
        }
    } catch (error) {
        messageDiv.textContent = 'Error during login. Please try again.';
    }
});