function validateAdmin(req, res, next) {
    const authHeader = req.headers["x-auth"];
    if (!authHeader || authHeader !== "logged in") {
        console.log("No tiene acceso!");
        return res.redirect("/login.html");
    }
    next();
}

module.exports = validateAdmin;