try {
    if (sessionStorage.getItem('session') == null) {
        alert('Necesitas haber iniciado sesión para acceder');
        window.location.href = '/login'
    }
} catch (e) {
    console.log('error random' + e);
}

document.addEventListener('DOMContentLoaded', async () => {
    const ctxTemp = document.getElementById('temperatureChart').getContext('2d');
    const ctxPh = document.getElementById('phChart').getContext('2d');

    let temperatureLabels = [];
    let temperatureData = [];
    let phLabels = [];
    let phData = [];

    const fetchData = async () => {
        try {
            const response = await fetch('https://api.thingspeak.com/channels/2483355/feeds.json?start=2024-05-03&end=2024-05-10&apikey=FDOT41Q3QLNOC1UQ');
            const data = await response.json();

            // Limpiar datos antiguos
            temperatureLabels = [];
            temperatureData = [];
            phLabels = [];
            phData = [];

            data.feeds.forEach(feed => {
                const date = new Date(feed.created_at);
                const label = `${date.getUTCHours()}:${date.getUTCMinutes() < 10 ? '0' : ''}${date.getUTCMinutes()}`;

                // Asumiendo que field1 es temperatura y field2 es pH
                if (feed.field1 !== null) {
                    temperatureLabels.push(label);
                    temperatureData.push(parseFloat(feed.field1));
                }
                if (feed.field2 !== null) {
                    phLabels.push(label);
                    phData.push(parseFloat(feed.field2));
                }
            });

            createCharts();
            updateTable(data.feeds[data.feeds.length - 1]); // Actualiza la tabla con el último dato
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    
    // Función para actualizar los datos en la tabla sin borrar las filas
    const updateTable = (latestData) => {
        const tableBody = document.getElementById('poolsTable').getElementsByTagName('tbody')[0];
        if (tableBody.rows.length > 0) {
            const row = tableBody.rows[0]; // asumimos que hay una sola fila que actualizar
            row.cells[2].textContent = latestData.field3 || 'No disponible'; // Nivel
            row.cells[3].textContent = latestData.field1 || 'No disponible'; // Temperatura
            row.cells[6].textContent = latestData.field2 || 'No disponible'; // pH
        }
    };
    

    // Cargar datos iniciales para la tabla
    const loadInitialTableData = async () => {
        const res = await fetch('https://api.thingspeak.com/channels/2483355/feeds.json?start=2024-05-03&end=2024-05-10&apikey=FDOT41Q3QLNOC1UQ');
        const data = await res.json();
        const lastFeed = data.feeds[data.feeds.length - 1];

        const response = await fetch('/pool/show');
        const pools = await response.json();
        const tableBody = document.getElementById('poolsTable').getElementsByTagName('tbody')[0];
        pools.forEach(pool => {
            let row = tableBody.insertRow();
            row.insertCell(0).textContent = pool.name;
            row.insertCell(1).textContent = pool.meters;
            row.insertCell(2).textContent = lastFeed.field3; // Nivel de agua
            row.insertCell(3).textContent = lastFeed.field1; // Temperatura actual
            row.insertCell(4).textContent = pool.temperature_ideal; 
            row.insertCell(5).textContent = pool.ph_ideal;
            row.insertCell(6).textContent = lastFeed.field2; // pH actual
        });
    };

    const createCharts = () => {
        const temperatureChart = new Chart(ctxTemp, {
            type: 'line',
            data: {
                labels: temperatureLabels,
                datasets: [{
                    label: 'Temperatura Actual',
                    data: temperatureData,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'category',
                        title: {
                            display: true,
                            text: 'Hora:Minuto'
                        }
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        const phChart = new Chart(ctxPh, {
            type: 'line',
            data: {
                labels: phLabels,
                datasets: [{
                    label: 'pH Actual',
                    data: phData,
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'category',
                        title: {
                            display: true,
                            text: 'Hora:Minuto'
                        }
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    };

    loadInitialTableData();
    fetchData();
});
