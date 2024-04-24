// pool.js (Controlador)
const Pool = require('../models/pool');
const axios = require('axios');


exports.getpool = async(req,res) =>{
    try {
        const pools = await Pool.find();  // Encuentra todas las albercas en la base de datos
        res.status(200).json(pools);  // Envía los datos de las albercas al cliente
    } catch (error) {
        console.error("Error obteniendo las albercas:", error);
        res.status(500).json({ error: 'Error al obtener las albercas' });
    }
};