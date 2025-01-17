const DEPLOY_URL = 'https://script.google.com/macros/s/AKfycbz5kzPLRSwumXtuN84KPwK2XJ8Aetf8AfxB9U4G3n-6g4ZsgZrl3_EeucPogG1TqxZQDA/exec';
const IMGBB_API_KEY = 'a1aab7277069e3d6fa62ab397ae5dfca';

let userDetails = null;

async function loadLoans() {
    try {
        const response = await fetch(`${DEPLOY_URL}?action=getLoans`, {
            method: 'POST'
        });
        const data = await response.json();
        displayLoans(data.loans);
    } catch (error) {
        console.error('Error loading loans:', error);
    }
}

function displayLoans(loans) {
    const loansDiv = document.getElementById('loansList');
    loans.forEach(loan => {
        const loanCard = document.createElement('div');
        loanCard.className = 'loan-card';
        loanCard.innerHTML = `
        <div class="title-menu">
        <div>
            <h3>${loan.title}</h3>
            <p>Recemmend For You<p>
        </div>
            <button onclick="openApplication('${loan.amount}', '${loan.interest}', '${loan.time}')">
                Apply
            </button>
        </div>
        <div class="loan-proof">
            <span>₹${loan.amount} <p>Amount</p> </span>
            <span>${loan.interest}% <p>Interest</p> </span>
            <span><p>${loan.time} days</p></span>
        </div>
        `;
        loansDiv.appendChild(loanCard);
    });
}


async function openApplication(amount, interest, time) {
    const loanEmail = localStorage.getItem('loan_email');
    if (!loanEmail) {
        alert('Please login first');
        window.location.href="login.html"
        return;
    }

    try {
        const response = await fetch(`${DEPLOY_URL}?action=getUserDetails`, {
            method: 'POST',
            body: JSON.stringify({ email: loanEmail })
        });
        const data = await response.json();
        
        if (data.success) {
            userDetails = data.userDetails;
            document.getElementById('selectedAmount').value = amount;
            document.getElementById('selectedInterest').value = interest;
            document.getElementById('selectedTime').value = time;
            document.getElementById('applicationModal').style.display = 'block';
        } else {
            alert('Unable to fetch user details. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching user details');
    }
}

async function uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        return data.data.url;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}

function closeModal() {
    document.getElementById('applicationModal').style.display = 'none';
    document.getElementById('loanForm').reset();
}

document.getElementById('loanForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const aadharFile = document.getElementById('aadharCard').files[0];
    const panFile = document.getElementById('panCard').files[0];

    try {
        const aadharUrl = await uploadImage(aadharFile);
        const panUrl = await uploadImage(panFile);

        const loanData = {
            amount: document.getElementById('selectedAmount').value,
            interest: document.getElementById('selectedInterest').value,
            time: document.getElementById('selectedTime').value,
            aadharUrl,
            panUrl,
            ...userDetails
        };

        const response = await fetch(`${DEPLOY_URL}?action=submitApplication`, {
            method: 'POST',
            body: JSON.stringify(loanData)
        });

        const result = await response.json();
        if (result.success) {
            window.location.href="success.html"
            closeModal();
        } else {
            alert(result.message || 'Error submitting application');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error submitting application');
    }
});

loadLoans();