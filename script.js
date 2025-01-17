async function fetchDueAmount() {
    const email = localStorage.getItem('loan_email');
    if (!email) {
        alert('Please Login First');
        window.location.href="login.html";
        return;
    }

    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbz7dnDkXfyIblSadgUh7jCoelk2J4hOAxBW3O65J4n55gPRDokWo52wPbMmqHFCn4UIKA/exec?email=' + encodeURIComponent(email));
        const data = await response.json();

        if (data.success) {
            document.getElementById('Name').innerHTML = `<span class="hello">Hello, <p> ${data.amount}</p></span>`;
            document.getElementById('email').value = email;
            document.getElementById('amount').value = data.amount;
        } else {
            alert('Error fetching due amount: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

window.onload = fetchDueAmount;