const mongoose = require("mongoose");

const poolShema = new mongoose.Schema({
    name: { type: String, required: true },
    meters: { type: Number, required: true} ,
    nivel: {type:Number},
    temperature_actual: { type: Number},
    temperature_ideal: { type: Number, required: true},
    ph_ideal:{type: Number},
    ph_actual:{type: Number},
    status: {type: Number,default: 1},
});
const Pool = mongoose.model("pool", poolShema);

module.exports = Pool;