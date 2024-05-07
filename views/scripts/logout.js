document.addEventListener('DOMContentLoaded', function() {
    var logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        console.log('Logout button is found'); // Check if the button is found
        logoutButton.addEventListener('click', function() {
            fetch('/logout')
                .then(response => {
                    console.log('Logout successful'); // Check if logout is successful
                    window.location.href = '/login';
                })
                .catch(error => console.error('Logout failed', error));
        });
    } else {
        console.error("Logout button not found");
    }
});
