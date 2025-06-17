idocument.addEventListener('DOMContentLoaded', function() {
    if(!localStorage.getItem('authToken')) {
        window.location.href = '/login.html';
    }
    
    // Opcional: Verificar token con el servidor (para mayor seguridad)
    fetch('/api/auth/verify', {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('authToken')
        }
    }).then(response => {
        if(!response.ok) {
            localStorage.removeItem('authToken');
            window.location.href = '/login.html';
        }
    });
});