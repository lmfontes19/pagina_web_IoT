try {
    if (sessionStorage.getItem('session') == null) {
        alert('Necesitas haber iniciado sesión para acceder');
        window.location.href = '/login';
    } else {
        if (sessionStorage.getItem('type') !== "admin") {
            alert('Necesitas ser administrador para acceder');
            window.location.href = '/normal_home';
        }
    }
} catch (e) {
    console.log('error random' + e);
}

document.getElementById('add-pool-form').addEventListener('submit', async function (event) {
    event.preventDefault();  // Prevenir la recarga de la página

    const form = event.target;
    const poolData = {
        name: form.name.value,
        meters: form.meters.value,
        temperature_ideal: form.temperature_ideal.value,
        ph_ideal: form.ph_ideal.value
    };

    try {
        const response = await fetch('/pool/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(poolData)
        });
        console.log(response);

        if (response.ok) {
            alert('Alberca agregada correctamente');
            form.reset();  // Resetear el formulario
            window.location.href = "/admin_home"
        } else {
            const errorData = await response.json();
            alert('Error al agregar alberca: ' + errorData.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al agregar la alberca');
    }
});
