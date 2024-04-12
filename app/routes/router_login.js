const User = require("../../app/models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const auth = require("../controllers/auth");
const db = require("../../server");


async function getUsers(req, res) {
    try {
        const usuarios = await User.find();

        return res.status(200).json(usuarios);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener usuarios." });
    }
}
router.get("/users", getUsers);


async function loginUser(req, res) {
    let userFlag = false;

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Los datos recibidos son inválidos." });
        }

        const formatoCorreoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!formatoCorreoValido) {
            return res.status(401).json({ message: "El formato del correo electrónico no es válido." });
        }

        await User.find({ email: email })
            .then((usuarioExistente) => {
                if (usuarioExistente[0] === undefined)
                    return;
                if (usuarioExistente[0].email === email && bcrypt.compareSync(password, usuarioExistente[0].password)) {
                    userFlag = true;
                    return;
                }
            }).catch((err) => { console.log("Find error:", err); });

        if (userFlag) {
            return res.status(200).json({ message: "Iniciando sesion." });
        }

        return res.status(402).json({ message: "El usuario no existe." });
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener usuarios." });
    }
}
router.post("/api/login", loginUser);


async function registerUsers(req, res) {
    let userFlag = false;

    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Los datos recibidos son inválidos." });
        }

        const formatoCorreoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!formatoCorreoValido) {
            return res.status(401).json({ message: "El formato del correo electrónico no es válido." });
        }

        await User.find({ email: email })
            .then((usuarioExistente) => {
                if (usuarioExistente[0] === undefined)
                    return;

                if (usuarioExistente[0].email === email) {
                    userFlag = true;
                    return;
                }
            }).catch((err) => { console.log("Find error:", err); });

        if (userFlag) {
            return res.status(402).json({ message: "El usuario ya existe." });
        }

        let passwdEncrypted = bcrypt.hashSync(password, 10);

        const user = new User({
            name: name,
            email: email,
            password: passwdEncrypted,
        });
        await user.save().then((doc) => { console.log("Usuario creado!" + doc); }).catch((err) => { console.log("Save error:", err); });

        return res.status(200).json({ message: "Usuario creado." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
router.post("/api/users", registerUsers);


async function updatePassword(req, res) {
    let userFlag = false;
    let name = "";

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Los datos recibidos son inválidos." });
        }

        const formatoCorreoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!formatoCorreoValido) {
            return res.status(402).json({ message: "El formato del correo electrónico no es válido." });
        }

        await User.find({ email: email })
            .then((usuarioExistente) => {
                if (usuarioExistente[0] === undefined)
                    return;

                if (usuarioExistente[0].email === email) {
                    userFlag = true;
                    name = usuarioExistente[0].name;
                    return;
                }
            }).catch((err) => { console.log("Find error:", err); });

        if (userFlag) {
            let passwdEncrypted = bcrypt.hashSync(password, 10);
            const resultado = await User.deleteOne({ email: email });
            console.log(resultado.deletedCount);
            if (resultado.deletedCount === 1) {
                const user = new User({
                    name: name,
                    email: email,
                    password: passwdEncrypted,
                });
                await user.save().then((doc) => { console.log("Usuario modificado!" + doc); }).catch((err) => { console.log("Save error:", err); });
            }
        }

        return res.status(200).json({ message: "Contraseña cambiada." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
router.put("/api/update", updatePassword)


async function deleteUser(req, res) {
    let userFlag = false;

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Los datos recibidos son inválidos." });
        }

        const formatoCorreoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!formatoCorreoValido) {
            return res.status(401).json({ message: "El formato del correo electrónico no es válido." });
        }

        await User.find({ email: email })
            .then((usuarioExistente) => {
                if (usuarioExistente[0] === undefined)
                    return;
                if (usuarioExistente[0].email === email && bcrypt.compareSync(password, usuarioExistente[0].password)) {
                    userFlag = true;
                    return;
                }
            }).catch((err) => { console.log("Find error:", err); });

        if (userFlag) {
            const resultado = await User.deleteOne({ email: email });
            if (resultado.deletedCount === 1) {
                return res.status(200).json({ message: "Usuario eliminado correctamente." });
            }
        }
        return res.status(402).json({ message: "No se encontró un usuario con ese correo." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
router.delete("/api/delete", deleteUser)

async function updateEmailAndName(req, res) {
    const { password, newEmail, newName } = req.body;

    try {
        // Buscar al usuario por la contraseña actual
        const user = await User.findOne({ password });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }


        // Actualizar el correo electrónico y el nombre
        user.email = newEmail;
        user.name = newName;

        await user.save();

        return res.status(200).json({ message: 'Correo electrónico y nombre actualizados correctamente.' });
    } catch (error) {
        console.error('Error al actualizar el correo electrónico y el nombre:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Ruta para actualizar correo electrónico y nombre por contraseña
router.put('/updateEmailAndName', updateEmailAndName);

module.exports = router;