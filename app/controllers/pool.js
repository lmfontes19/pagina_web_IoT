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

exports.addPool = async (req, res) => {
    try {
        // Obtener datos de ThingSpeak
        const apiResponse = await axios.get('https://api.thingspeak.com/channels/2483355/feeds.json?start=2024-05-04&end=2024-05-10&api_key=FDOT41Q3QLNOC1UQ');
        const data = apiResponse.data.feeds[0]; // Asumiendo que el primer 'feed' contiene los datos más recientes

        const { name, meters, temperature_ideal, ph_ideal } = req.body;
        const temperature_actual = data.field1; // Asumiendo que field1 es la temperatura actual
        const ph_actual = data.field2; // Asumiendo que field2 es el pH actual
        const nivel = data.field3;

        const newPool = new Pool({
            name,
            meters,
            nivel,
            temperature_ideal,
            temperature_actual,
            ph_ideal,
            ph_actual,
            status: 1  // Estado predeterminado, si es aplicable
        });

        await newPool.save();
        res.status(201).json({ message: 'Alberca agregada correctamente' });
    } catch (error) {
        console.error("Error agregando alberca:", error);
        res.status(500).json({ error: error.message });
    }
};