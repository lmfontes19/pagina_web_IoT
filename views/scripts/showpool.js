try {
    if (sessionStorage.getItem('session') == null) {
        console.log('no existe');
        window.location.href = '/login'
    }
} catch (e) {
    console.log('error random' + e);
}

document.addEventListener('DOMContentLoaded', async () => {
    const ctxTemp = document.getElementById('temperatureChart').getContext('2d');
    const ctxPh = document.getElementById('phChart').getContext('2d');

    // Crear las etiquetas horarias para el eje X
    const hours = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
                   '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];

    const temperatureChart = new Chart(ctxTemp, {
        type: 'line',
        data: {
            labels: hours, // Utiliza las etiquetas horarias predefinidas
            datasets: [{
                label: 'Temperatura Actual',
                data: new Array(24).fill(null), // Inicializa con un arreglo de nulos
                borderColor: 'rgb(255, 104, 57)',
                backgroundColor: 'rgba(255, 104, 57, 0.8)',
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'category'
                },
                y: {
                    beginAtZero: false
                }
            }
        }
    });

    const phChart = new Chart(ctxPh, {
        type: 'line',
        data: {
            labels: hours, // Utiliza las etiquetas horarias predefinidas
            datasets: [{
                label: 'pH Actual',
                data: new Array(24).fill(null), // Inicializa con un arreglo de nulos
                borderColor: 'rgb(140, 168, 124)',
                backgroundColor: 'rgba(140, 168, 124, 0.8)',
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'category'
                },
                y: {
                    beginAtZero: false
                }
            }
        }
    });

    try {
        const response = await fetch('/pool/show'); // Asegúrate de que esta ruta esté configurada en tu servidor
        if (response.ok) {
            const pools = await response.json();
            const tableBody = document.getElementById('poolsTable').getElementsByTagName('tbody')[0];
            pools.forEach(pool => {
                let row = tableBody.insertRow();
                row.insertCell(0).textContent = pool.name;
                row.insertCell(1).textContent = pool.meters;
                row.insertCell(2).textContent = pool.nivel || 'No disponible';
                row.insertCell(3).textContent = pool.temperature_actual || 'No disponible';
                row.insertCell(4).textContent = pool.temperature_ideal;
                row.insertCell(5).textContent = pool.ph_ideal;
                row.insertCell(6).textContent = pool.ph_actual || 'No disponible';

                // Supongamos que estos son índices horarios para la demostración
                const hourIndex = new Date().getHours(); // Solo para demostración
                temperatureChart.data.datasets[0].data[hourIndex] = pool.temperature_actual;
                phChart.data.datasets[0].data[hourIndex] = pool.ph_actual;
            });
            temperatureChart.update();
            phChart.update();
        } else {
            const errorMessage = await response.text();
            console.error('Error al cargar las albercas:', errorMessage);
            alert(`Error al cargar las albercas: ${errorMessage}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al cargar las albercas');
    }
});
