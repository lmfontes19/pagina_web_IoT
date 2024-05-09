try {
    if (sessionStorage.getItem('session') == null) {
        alert('Necesitas haber iniciado sesión para acceder');
        window.location.href = '/login'
    }
} catch (e) {
    console.log('error random' + e);
}