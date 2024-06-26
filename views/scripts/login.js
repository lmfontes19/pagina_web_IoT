const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");
sessionStorage.clear();

registerBtn.addEventListener("click", () => {
    container.classList.add("active");
});


loginBtn.addEventListener("click", () => {
    container.classList.remove("active");
});


async function iniciarSesion() {
    try {
        var email = document.getElementById("loginEmail").value;
        var passwd = document.getElementById("loginPassword").value;

        const response = await fetch("/login/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-auth": "logged in"
            },
            body: JSON.stringify({
                email: email,
                password: passwd,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Usuario autenticado:", data);
            var sessionId = '';
            const usuarios = await obtenerUsuarios();
            var usuariosArray = usuarios;

            for (var i = 0; i < usuariosArray.length; i++) {
                var usuario = usuariosArray[i];
                if (usuario.email === email) {
                    sessionId = usuario.password;
                    type = usuario.type;
                    console.log("Coincidió el email. SessionId:", sessionId);
                    break;
                } else {
                    console.log('usuario no x')
                }
            }

            sessionStorage.setItem('session', sessionId);
            sessionStorage.setItem('type', type);
            if (type === 'admin') {
                window.location.href = "/admin_home";
            } else if (type === 'normal') {
                window.location.href = "/normal_home";
            } else {
                console.error('Unknown user type:', type);
            }

        } else {
            document.getElementById("login-error-message").textContent = data.message;
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("login-error-message").textContent = "No pudimos encontrar tu cuenta";
    }
}


async function registrarUsuario() {
    try {
        var name = document.getElementById("registerName").value;
        var email = document.getElementById("registerEmail").value;
        var passwd = document.getElementById("registerPassword").value;
        var typeUser = document.querySelector('input[name="typeUser"]:checked').value;

        const response = await fetch("/login/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: passwd,
                type: typeUser
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Usuario registrado:", data);
            var sessionId = '';
            const usuarios = await obtenerUsuarios();
            var usuariosArray = usuarios;

            for (var i = 0; i < usuariosArray.length; i++) {
                var usuario = usuariosArray[i];
                if (usuario.email === email) {
                    sessionId = usuario.password;
                    type = usuario.type;
                    console.log("Coincidió el email. SessionId:", sessionId);
                    break;
                } else {
                    console.log('usuario no x')
                }
            }

            sessionStorage.setItem('session', sessionId);
            sessionStorage.setItem('type', type);
            if (type === 'admin') {
                window.location.href = "/admin_home";
            } else if (type === 'normal') {
                window.location.href = "/normal_home";
            } else {
                console.error('Unknown user type:', type);
            }

        } else {
            console.error("Error al registrar usuario:", data.message);
            document.getElementById("singup-error-message").textContent = data.message;
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("signup-error-message").textContent = "No pudimos registrar tu correo electronico";
    }
}


async function cambiarContrasena() {
    try {
        var email = document.getElementById("emailUpdate").value;
        var passwd = document.getElementById("newPassword").value;

        const response = await fetch("/login/api/update", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: passwd,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Cambio realizado:", data);
            window.location.href = "/login"
        } else {
            console.error("Error al cambiar ontraseña:", data.message);
            document.getElementById("lvidarContrasena-error-message").textContent = data.message;
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("olvidarContrasena-error-message").textContent = "Hubo un error al intentar cambiar la contraseña.";
    }
}


function abrirContainerOlvidarContrasena() {
    document.getElementById("container").style.display = "none";
    document.getElementById("container-update").style.display = "block";
}


function cerrarContainerOlvidarContrasena() {
    document.getElementById("container").style.display = "block";
    document.getElementById("container-update").style.display = "none";
}

async function obtenerUsuarios() {
    try {
        const response = await fetch("/login/users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-auth": "logged in"
            },
        });

        if (!response.ok) {
            console.error("Error al obtener usuarios:", response.statusText);
            return;
        }

        const usuarios = await response.json();
        return usuarios;

    } catch (error) {
        console.error("Error al obtener usuarios:", error);
    }
}


async function getHome() {
    try {
        const response = await fetch("/home", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-auth": "logged in",
            },
        });

        if (response.ok) {
            sessionStorage.setItem("token", "");
        } else {
            console.error("Error al obtener la página de inicio:", response.status);
        }
    }
    catch (error) {
        console.log(error);
    }
}
