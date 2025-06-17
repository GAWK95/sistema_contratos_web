particlesJS('particles-js', {
    particles: {
        number: {
            value: 100, // Incrementa el número de partículas
            density: { enable: true, value_area: 1000 }
        },
        color: { value: ["#ffffff", "#00bfff", "#ff6347"] }, // Colores variados
        shape: {
            type: ["circle"], // Formas adicionales
            stroke: { width: 0, color: "#000000" }
        },
        opacity: {
            value: 0.5,
            random: true,
            anim: { enable: true, speed: 1, opacity_min: 0.3, sync: false }
        },
        size: {
            value: 3,
            random: true,
            anim: { enable: true, speed: 4, size_min: 0.3, sync: false }
        },
        line_linked: {
            enable: true,
            distance: 120,
            color: "#ffffff",
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: { enable: false, rotateX: 600, rotateY: 1200 }
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: { enable: true, mode: "grab" }, // Conexión al pasar el cursor
            onclick: { enable: true, mode: "push" }, // Añade partículas al hacer clic
            resize: true
        },
        modes: {
            grab: { distance: 140, line_linked: { opacity: 0.5 } },
            bubble: { distance: 200, size: 4, duration: 2, opacity: 0.8, speed: 3 },
            repulse: { distance: 100, duration: 0.4 },
            push: { particles_nb: 4 },
            remove: { particles_nb: 2 }
        }
    },
    retina_detect: true // Mejora para pantallas de alta resolución
});
