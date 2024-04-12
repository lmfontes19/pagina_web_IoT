const express = require("express");
const cors = require("cors");
const router = require("./app/controllers/router");
const mongoose = require("mongoose");


let mongoConnection = "mongodb+srv://admin:Pa$$w0rd@myapp.tpu6kou.mongodb.net/MyAppDB";
let db = mongoose.connection;


let app = express();
let puerto = 3000;


app.use(cors());
app.use(express.json());
app.use(router);
app.use(express.static("app"));
app.use("/views", express.static("./views"));
app.use("/style", express.static("./views/style"))
app.use("/script", express.static("./views/script"))


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