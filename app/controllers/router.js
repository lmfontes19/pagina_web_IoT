const express = require("express");
const path = require("path");
const loginRouter = require("../routes/router_login");
const homeRouter = require("../routes/router_home");


const router = express.Router();


router.use("/login", loginRouter);
router.use("/home", homeRouter);


router.get("/login", (req, res) => {
    res.sendFile(path.resolve(__dirname + "/../../views/login.html"));
});


router.get("/home", (req, res) => {
    res.sendFile(path.resolve(__dirname + "/../../views/home.html"));
});


module.exports = router;