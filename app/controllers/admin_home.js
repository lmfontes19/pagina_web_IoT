const Pool = require('../models/pool');
// Eliminar alberca
exports.deletePool = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await Pool.deleteOne({ _id: id }); // Usar deleteOne para eliminar directamente por ID
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "No se encontró la alberca con el ID proporcionado." });
        }
        res.status(200).json({ message: "Alberca eliminada exitosamente." });
    } catch (error) {
        console.error("Error al eliminar la alberca:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
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


// Obtener detalles de una alberca específica
exports.getPoolDetails = async (req, res) => {
    const { id } = req.params;
    console.log("Fetching details for pool with ID:", id); // Diagnóstico

    try {
        const pool = await Pool.findById(id);
        if (pool) {
            console.log("Pool found:", pool); // Diagnóstico
            res.status(200).json(pool);
        } else {
            console.log("Pool not found with ID:", id); // Diagnóstico
            res.status(404).json({ message: "Alberca no encontrada" });
        }
    } catch (error) {
        console.error("Error al obtener la alberca:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};