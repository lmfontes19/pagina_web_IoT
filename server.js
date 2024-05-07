const express = require("express");
const cors = require("cors");
const router = require("./app/controllers/router");
const mongoose = require("mongoose");
const session = require('express-session');


let mongoConnection = "mongodb+srv://admin:Pa$$w0rd@myapp.tpu6kou.mongodb.net/MyAppDB";
let db = mongoose.connection;


let app = express();
let puerto = 3000;


app.use(cors());
app.use(express.json());
app.use(express.static("app"));
app.use("/views", express.static("./views"));
app.use("/style", express.static("./views/style"))
app.use("/script", express.static("./views/script"))
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: !true } // set to true if you're using HTTPS
}));

app.use(router);
app.listen(puerto, () => {
    console.log("Practica 3 puerto:" + puerto); 
});


db.on("connecting", () => {
    console.log("Connecting...");
    console.log(mongoose.connection.readyState);
});


db.on("connected", () => {
    console.log("Connected!");
    console.log(mongoose.connection.readyState);
});
mongoose.connect(mongoConnection);


module.exports = router;
module.exports = db;