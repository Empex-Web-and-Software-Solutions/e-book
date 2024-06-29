document.getElementById('email-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;

    fetch('https://e-book-backend-3a119580cbea.herokuapp.com/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
    })
    .then(response => response.text())
    .then(data => {
        alert('Download link has been sent to your email.');
        document.getElementById('email-form').reset();
    })
    .catch(error => {
        alert('Error sending email. Please try again later.');
    });
});
