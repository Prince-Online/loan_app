let userEmail = '';
let dueAmountValue = 0;

async function fetchDueAmount() {
    const email = localStorage.getItem('loan_email');
    if (!email) {
        alert('No loan_email found in localStorage');
        return;
    }
    userEmail = email;
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbyHEjrfmq7i1vnaLhHdfTpD4t59HnvGN5fqjiHuo-lubALD1IXotui-1izdMOZUaEMxqg/exec?email=' + encodeURIComponent(email));
        const data = await response.json();
        if (data.success) {
            dueAmountValue = data.amount;
            document.getElementById('dueAmount').innerHTML = `Due Amount: <b>₹${data.amount}</b>`;
            document.getElementById('paymentAmount').value = data.amount;
            updateQRCode(data.amount);
        } else {
            alert('Error fetching due amount: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch due amount.');
    }
}

function updateQRCode(amount) {
    const upiId = 'createprincemahto-2@okaxis';
    const upiLink = `upi://pay?pa=${upiId}&am=${amount}&cu=INR`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;
    document.getElementById('qrCode').src = qrCodeUrl;
}

document.getElementById('paymentAmount').addEventListener('input', function(e) {
    updateQRCode(e.target.value);
});

async function uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', 'a1aab7277069e3d6fa62ab397ae5dfca');

    try {
        const response = await fetch('https://api.imgbb.com/1/upload', {
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

async function submitForm() {
    const amount = document.getElementById('paymentAmount').value;
    const paymentProof = document.getElementById('paymentProof').files[0];
    
    if (!amount || !paymentProof) {
        alert('Please fill all required fields');
        return;
    }

    try {
        const imageUrl = await uploadImage(paymentProof);
        
        const response = await fetch('https://script.google.com/macros/s/AKfycbyHEjrfmq7i1vnaLhHdfTpD4t59HnvGN5fqjiHuo-lubALD1IXotui-1izdMOZUaEMxqg/exec', {
            method: 'POST',
            body: JSON.stringify({
                email: userEmail,
                amount: amount,
                imageUrl: imageUrl
            })
        });

        const data = await response.json();
        if (data.success) {
            alert('Payment submitted successfully!');
            window.location.reload();
        } else {
            alert('Error submitting payment: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to submit payment.');
    }
}

window.onload = fetchDueAmount;