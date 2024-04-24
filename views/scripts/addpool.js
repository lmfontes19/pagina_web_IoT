document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-pool-form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const requestBody = {};
        formData.forEach((value, key) => {
            requestBody[key] = value;
        });

        try {
            const response = await fetch('/pool/add', {  // Actualizado para coincidir con la nueva ruta del servidor
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                alert('Alberca agregada correctamente');
                form.reset();
                window.location.href = '/admin_home'; 
                
            } else {
                const errorMessage = await response.text();
                alert(`Error al agregar alberca: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al agregar la alberca');
        }
    });
});
