function validateAdmin(req, res, next) {
    const authHeader = req.headers["x-auth"];
    if (!authHeader || authHeader !== "admin") {
        console.log("No tiene acceso de admin!");
        return res.status(403).send("Acceso denegado. No eres admin");
    }
    next();
}

module.exports = validateAdmin;
