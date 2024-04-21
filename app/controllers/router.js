const express = require("express");
const path = require("path");
const loginRouter = require("../routes/router_login");
const homeRouterAdmin = require("../routes/router_admin_home");
const homeRouterNormal = require("../routes/router_normal_home");


const router = express.Router();


router.use("/login", loginRouter);
router.use("/admin_home", homeRouterAdmin);
router.use("/normal_home", homeRouterNormal);


router.get("/login", (req, res) => {
    res.sendFile(path.resolve(__dirname + "/../../views/login.html"));
});


router.get("/admin_home", (req, res) => {
    res.sendFile(path.resolve(__dirname + "/../../views/admin_home.html"));
});


router.get("/normal_home", (req, res) => {
    res.sendFile(path.resolve(__dirname + "/../../views/normal_home.html"));
});


module.exports = router;