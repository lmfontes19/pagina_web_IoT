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

document.addEventListener('DOMContentLoaded', async () => {
    loadPools();
});

async function loadPools() {
    try {
        const response = await fetch('/pool/show');
        const pools =  await fetch('https://api.thingspeak.com/channels/2483355/feeds.json?start=2024-05-03&end=2024-05-10&apikey=FDOT41Q3QLNOC1UQ');
        const data = await pools.json();
        const feeds = data.feeds;
        const lastData = feeds[feeds.length - 1];

        if (response.ok) {
            const pools = await response.json();
            const tableBody = document.getElementById('poolsTable').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = ''; // Clear previous rows
            pools.forEach(pool => {
                let row = tableBody.insertRow();
                row.insertCell(0).textContent = pool.name;
                row.insertCell(1).textContent = pool.meters;
                row.insertCell(2).textContent = lastData.field3 || 'No disponible';
                row.insertCell(3).textContent = lastData.field1 || 'No disponible';
                row.insertCell(4).textContent = pool.temperature_ideal;
                row.insertCell(5).textContent = pool.ph_ideal;
                row.insertCell(6).textContent = lastData.field2 || 'No disponible';
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
    fetch(`/admin_home/delete/${id}`, { method: 'DELETE'})
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

};


function editPool(poolId) {
    fetch(`/admin_home/details/${poolId}`)
    .then(response => {
        if (!response.ok) throw new Error(`Failed to fetch pool details: ${response.statusText}`);
        return response.json();
    })
    .then(poolData => {
        document.getElementById('editPoolId').value = poolId;
        document.getElementById('editPoolName').value = poolData.name;
        document.getElementById('editPoolMeters').value = poolData.meters;
        document.getElementById('editPoolTemperatureIdeal').value = poolData.temperature_ideal;
        document.getElementById('editPoolPhIdeal').value = poolData.ph_ideal;
        new bootstrap.Modal(document.getElementById('editPoolModal')).show();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al cargar la información de la alberca: ' + error.message);
    });
};


function submitEditPool() {
    const poolId = document.getElementById('editPoolId').value;
    const poolData = {
        name: document.getElementById('editPoolName').value,
        meters: document.getElementById('editPoolMeters').value,
        temperature_ideal: document.getElementById('editPoolTemperatureIdeal').value,
        ph_ideal: document.getElementById('editPoolPhIdeal').value
    };

    fetch(`/admin_home/update/${poolId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(poolData)
    })
    .then(response => {
        if (!response.ok) throw new Error('Error al actualizar la alberca');
        return response.json();
    })
    .then(updatedPool => {
        $('#editPoolModal').modal('hide');
        loadPools();  // Recargar la lista de albercas
        console.log('Alberca actualizada:', updatedPool);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al actualizar la alberca.');
    });
};