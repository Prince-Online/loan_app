async function fetchDueAmount() {
    const email = localStorage.getItem('loan_email');
    if (!email) {
        alert('Please Login First');
        window.location.href="login.html";
        return;
    }

    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbxRQO7ZwYBUsKIGRMfzKPm0aNd5Nm4P7qYe0cHLPC1Ky7dsizq7Q1tg0FtheTw2pXmgGw/exec?email=' + encodeURIComponent(email));
        const data = await response.json();

        if (data.success) {
            document.getElementById('dueAmount').innerHTML = `
            <div class="pay">
            <img src="https://i.ibb.co/bPBpbfb/rupee.png">
            Currently You Need To Pay <b>₹${data.amount}</b>
            <a href="pay.html"><button type="submit">Pay</button></a>
            </div>
            `;
            document.getElementById('email').value = email;
            document.getElementById('amount').value = data.amount;
        } else {
            alert('Error fetching due amount: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch due amount.');
    }
}

window.onload = fetchDueAmount;