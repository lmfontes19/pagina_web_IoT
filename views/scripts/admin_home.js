try {
    if (sessionStorage.getItem('session') == null) {
        console.log('no existe');
        window.location.href = '/login'
    }
} catch (e) {
    console.log('error random' + e);
}