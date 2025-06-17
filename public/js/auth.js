document.addEventListener('DOMContentLoaded', function() {
    // Inicializar partículas
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
            move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "out" }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "grab" },
                onclick: { enable: true, mode: "push" }
            }
        }
    });

    // Mostrar/ocultar contraseña
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');
    
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.innerHTML = type === 'password' ? '<i class="bi bi-eye"></i>' : '<i class="bi bi-eye-slash"></i>';
    });

    // Validación del formulario
    const loginForm = document.getElementById('loginForm');
    const notification = document.getElementById('notification');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        
        // Validación simple
        if (!username || !password) {
            showNotification('Por favor completa todos los campos', 'error');
            return;
        }
        
        // Simular carga
        simulateLogin(username, password);
    });
  
    // Función para mostrar notificación
    function showNotification(message, type = 'success') {
        notification.textContent = message;
        notification.className = 'notification show';
        
        if (type === 'error') {
            notification.style.background = 'rgba(231, 76, 60, 0.9)';
        } else {
            notification.style.background = 'rgba(46, 204, 113, 0.9)';
        }
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // Función para simular login (reemplazar con llamada real a tu API)
    function simulateLogin(username, password) {
        // Aquí normalmente harías una llamada AJAX a tu backend
        console.log(`Intento de login con usuario: ${username} y contraseña: ${password}`);
        
        // Simular retraso de red
        setTimeout(() => {
            // Simular respuesta exitosa (en producción verificarías con tu backend)
            if (username === 'admin' && password === 'admin123') {
                showNotification('Acceso concedido. Redirigiendo...', 'success');
                
                // Redirigir al dashboard después de 2 segundos
                setTimeout(() => {
                    window.location.href = '/index.html'; // O tu ruta principal
                }, 2000);
            } else {
                showNotification('Credenciales incorrectas', 'error');
            }
        }, 1500);
    }
    document.addEventListener('DOMContentLoaded', function() {
        const logo = document.querySelector('.logo-container img');
        logo.style.opacity = '0';
        logo.style.transform = 'translateY(-20px)';
        logo.style.transition = 'all 0.5s ease-out';
        
        setTimeout(() => {
            logo.style.opacity = '1';
            logo.style.transform = 'translateY(0)';
        }, 300);
    });
    // Efecto de ondas en el botón
    const authBtn = document.querySelector('.auth-btn');
    
    authBtn.addEventListener('click', function(e) {
        const x = e.clientX - e.target.getBoundingClientRect().left;
        const y = e.clientY - e.target.getBoundingClientRect().top;
        
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 1000);
        
    });
});
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar partículas
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
            move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "out" }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "grab" },
                onclick: { enable: true, mode: "push" }
            }
        }
    });

    // Mostrar/ocultar contraseña
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');
    
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.innerHTML = type === 'password' ? '<i class="bi bi-eye"></i>' : '<i class="bi bi-eye-slash"></i>';
    });

    // Validación del formulario
    const loginForm = document.getElementById('loginForm');
    const notification = document.getElementById('notification');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        
        // Validación simple
        if (!username || !password) {
            showNotification('Por favor completa todos los campos', 'error');
            return;
        }
        
        // Simular carga
        simulateLogin(username, password);
    });
  
    // Función para mostrar notificación
    function showNotification(message, type = 'success') {
        notification.textContent = message;
        notification.className = 'notification show';
        
        if (type === 'error') {
            notification.style.background = 'rgba(231, 76, 60, 0.9)';
        } else {
            notification.style.background = 'rgba(46, 204, 113, 0.9)';
        }
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // Función para simular login (reemplazar con llamada real a tu API)
    function simulateLogin(username, password) {
        // Aquí normalmente harías una llamada AJAX a tu backend
        console.log(`Intento de login con usuario: ${username} y contraseña: ${password}`);
        
        // Simular retraso de red
        setTimeout(() => {
            // Simular respuesta exitosa (en producción verificarías con tu backend)
            if (username === 'admin' && password === 'admin123') {
                showNotification('Acceso concedido. Redirigiendo...', 'success');
                
                // Redirigir al dashboard después de 2 segundos
                setTimeout(() => {
                    window.location.href = '/index.html'; // O tu ruta principal
                }, 2000);
            } else {
                showNotification('Credenciales incorrectas', 'error');
            }
        }, 1500);
    }
    document.addEventListener('DOMContentLoaded', function() {
        const logo = document.querySelector('.logo-container img');
        logo.style.opacity = '0';
        logo.style.transform = 'translateY(-20px)';
        logo.style.transition = 'all 0.5s ease-out';
        
        setTimeout(() => {
            logo.style.opacity = '1';
            logo.style.transform = 'translateY(0)';
        }, 300);
    });
    // Efecto de ondas en el botón
    const authBtn = document.querySelector('.auth-btn');
    
    authBtn.addEventListener('click', function(e) {
        const x = e.clientX - e.target.getBoundingClientRect().left;
        const y = e.clientY - e.target.getBoundingClientRect().top;
        
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 1000);
          
 

    });
});

   // Función para cerrar sesión
    function cerrarSesion() {
    console.log("Cerrando sesión...");
    localStorage.removeItem("usuario");
    window.location.href = "login.html";
}
