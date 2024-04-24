document.addEventListener('DOMContentLoaded', async () => {
    loadPools();
});

async function loadPools() {
    try {
        const response = await fetch('/pool/show');
        if (response.ok) {
            const pools = await response.json();
            const tableBody = document.getElementById('poolsTable').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = ''; // Clear previous rows
            pools.forEach(pool => {
                let row = tableBody.insertRow();
                row.insertCell(0).textContent = pool.name;
                row.insertCell(1).textContent = pool.meters;
                row.insertCell(2).textContent = pool.nivel || 'N/A';
                row.insertCell(3).textContent = pool.temperature_actual || 'N/A';
                row.insertCell(4).textContent = pool.temperature_ideal;
                row.insertCell(5).textContent = pool.ph_ideal;
                row.insertCell(6).textContent = pool.ph_actual || 'N/A';
                let actionsCell = row.insertCell(7);
                actionsCell.innerHTML = `<button class="btn btn-primary" onclick="editPool('${pool._id}')">Edit</button>
                                         <button class="btn btn-danger" onclick="deletePool('${pool._id}')">Delete</button>`;
            });
        } else {
            console.error('Failed to fetch pools');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};


function deletePool(id) {
    console.log("Deleting pool with ID:", id); // Confirma que el ID se recibe correctamente antes de enviarlo
    if (confirm("¿Confirmas la eliminación de la alberca?")) {
        fetch(`/admin_home/delete/${id}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                loadPools();  // Recarga la lista de albercas
            } else {
                console.error("Fallo al eliminar, estado HTTP:", response.status);
                alert("Fallo al eliminar alberca. Código de estado: " + response.status);
            }
        })
        .catch(error => {
            console.error('Error al intentar eliminar la alberca:', error);
            alert('Error al eliminar la alberca. Consulta la consola para más detalles.');
        });
    }
}
