const DEPLOY_URL = 'https://script.google.com/macros/s/AKfycbxgRf_G7sQfki_alD10rGUWKE5s8edl0OXdZvrPYXjuVcQJL06K_4c7-pvUOaxjyDaMhw/exec';
const form = document.getElementById('bankingForm');
const getOtpBtn = document.getElementById('getOtpBtn');
const otpSection = document.getElementById('otpSection');

getOtpBtn.addEventListener('click', async () => {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    if (!data.email || !data.name) {
        alert('Please fill in all required fields');
        return;
    }

    try {
        const response = await fetch(`${DEPLOY_URL}?action=generateOtp`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        if (result.success) {
            otpSection.style.display = 'flex';
            getOtpBtn.disabled = true;
            alert('OTP has been sent to your email!');
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert('Error generating OTP. Please try again.');
    }
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    try {
        const response = await fetch(`${DEPLOY_URL}?action=verifyOtp`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        if (result.success) {
            alert('Signup Successfully!');
            window.location.href="login.html";
            otpSection.style.display = 'none';
            getOtpBtn.disabled = false;
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert('Error submitting form. Please try again.');
    }
});