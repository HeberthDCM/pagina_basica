document.addEventListener('DOMContentLoaded', function() {
    const horasElement = document.getElementById('horas');
    const minutosElement = document.getElementById('minutos');
    const segundosElement = document.getElementById('segundos');
    const ampmElement = document.getElementById('ampm');
    const fechaElement = document.getElementById('fecha');

    function actualizarReloj() {
        const ahora = new Date();
        
        // Obtener horas, minutos y segundos
        let horas = ahora.getHours();
        const minutos = ahora.getMinutes().toString().padStart(2, '0');
        const segundos = ahora.getSeconds().toString().padStart(2, '0');
        
        // Formato 12 horas y AM/PM
        const ampm = horas >= 12 ? 'PM' : 'AM';
        horas = horas % 12 || 12;
        
        // Actualizar elementos del DOM
        horasElement.textContent = horas.toString().padStart(2, '0');
        minutosElement.textContent = minutos;
        segundosElement.textContent = segundos;
        ampmElement.textContent = ampm;
        
        // Actualizar fecha
        const opcionesFecha = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        fechaElement.textContent = ahora.toLocaleDateString('es-ES', opcionesFecha);
    }

    // Actualizar el reloj inmediatamente y luego cada segundo
    actualizarReloj();
    setInterval(actualizarReloj, 1000);
});