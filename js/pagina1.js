// Función para formatear números con dos dígitos
function formatearDosDigitos(numero) {
    return numero < 10 ? '0' + numero : numero;
}

// Función para obtener el nombre del día de la semana
function obtenerNombreDia(numeroDia) {
    const dias = [
        'Domingo', 'Lunes', 'Martes', 'Miércoles', 
        'Jueves', 'Viernes', 'Sábado'
    ];
    return dias[numeroDia];
}

// Función para obtener el nombre del mes
function obtenerNombreMes(numeroMes) {
    const meses = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    return meses[numeroMes];
}

// Función para actualizar el reloj
function actualizarReloj() {
    const ahora = new Date();
    
    // Obtener hora, minutos y segundos
    const horas = formatearDosDigitos(ahora.getHours());
    const minutos = formatearDosDigitos(ahora.getMinutes());
    const segundos = formatearDosDigitos(ahora.getSeconds());
    
    // Formatear la hora
    const horaFormateada = `${horas}:${minutos}:${segundos}`;
    
    // Obtener elementos de fecha
    const diaSemana = ahora.getDay();
    const diaMes = ahora.getDate();
    const mes = ahora.getMonth();
    const año = ahora.getFullYear();
    
    // Formatear la fecha
    const fechaFormateada = `${obtenerNombreDia(diaSemana)}, ${diaMes} de ${obtenerNombreMes(mes)} de ${año}`;
    
    // Actualizar el DOM
    const horaActualElement = document.getElementById('hora-actual');
    const fechaActualElement = document.getElementById('fecha-actual');
    
    if (horaActualElement && fechaActualElement) {
        horaActualElement.textContent = horaFormateada;
        fechaActualElement.textContent = fechaFormateada;
    }
}

// Función para iniciar el reloj
function iniciarReloj() {
    console.log("Reloj iniciado");
    
    // Actualizar inmediatamente
    actualizarReloj();
    
    // Actualizar cada segundo
    setInterval(actualizarReloj, 1000);
}

// Configurar el botón de saludo
function configurarBotonSaludo() {
    const btnSaludo = document.getElementById('btn-saludo');
    const mensaje = document.getElementById('mensaje');
    
    if (btnSaludo && mensaje) {
        btnSaludo.addEventListener('click', function() {
            mensaje.textContent = '¡Hola! Bienvenido a la Página 1.';
            
            // Cambiar color temporalmente
            mensaje.style.color = '#e74c3c';
            setTimeout(() => {
                mensaje.style.color = '#2c3e50';
            }, 1000);
        });
    }
}

// Iniciar todo cuando se cargue la página
function inicializarPagina1() {
    iniciarReloj();
    configurarBotonSaludo();
}

// Llamar a la inicialización
inicializarPagina1();