const express = require('express');
const router = express.Router();

const logoutUser = async (req, res) => {
    try {
        await new Promise((resolve, reject) => {
            req.session.destroy(err => {
                if (err) reject(err);  // If there's an error in destroying the session, reject the promise
                else resolve();  // If session is successfully destroyed, resolve the promise
            });
        });
        res.redirect('/login');  // After session is destroyed, redirect to the login page
    } catch (error) {
        console.error("Error logging out:", error);
        res.status(500).json({ message: "Error al cerrar sesión." });  // If there's an error in the try block, send a 500 response
    }
};

router.get('/', logoutUser);  // Define a GET route that uses the logoutUser function

module.exports = router;  // Export the router for use in other parts of the application
