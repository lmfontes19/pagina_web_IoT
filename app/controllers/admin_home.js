const Pool = require('../models/pool');
const axios = require('axios');

exports.addPool = async (req, res) => {
    try {
        // Obtener datos de ThingSpeak
        const apiResponse = await axios.get('https://api.thingspeak.com/channels/2483355/feeds.json?results=1');
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
            ph_actual
        });

        await newPool.save();
        res.status(201).json({ message: 'Alberca agregada correctamente' });
    } catch (error) {
        console.error("Error agregando alberca:", error);
        res.status(500).json({ error: error.message });
    }
};

// Eliminar alberca
exports.deletePool = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedPool = await Pool.findByIdAndRemove(id);
        if (deletedPool) {
            res.status(200).json({ message: 'Alberca eliminada correctamente' });
        } else {
            res.status(404).json({ message: 'Alberca no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar alberca
exports.updatePool = async (req, res) => {
    const { id } = req.params;
    const { name, meters, temperature_ideal, ph_ideal } = req.body;
    try {
        const updatedPool = await Pool.findByIdAndUpdate(id, { name, meters, temperature_ideal, ph_ideal }, { new: true });
        if (updatedPool) {
            res.status(200).json({ message: 'Alberca actualizada correctamente', pool: updatedPool });
        } else {
            res.status(404).json({ message: 'Alberca no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la alberca' });
    }
};

// Obtener todas las albercas
exports.getPool = async (req, res) => {
    try {
        const pools = await Pool.find({});
        res.status(200).json(pools);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las albercas' });
    }
};