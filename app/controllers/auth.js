function validateAdmin(req, res, next) {
    const authHeader = req.headers["x-auth"];
    if (!authHeader || authHeader !== "normal" || authHeader !== "admin") {
        console.log("No tiene acceso!");
        return res.redirect("/login");
    }
    console.log("Tiene  acceso", authHeader);
    next();
}

module.exports = validateAdmin;