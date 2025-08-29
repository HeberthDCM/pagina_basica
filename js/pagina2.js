document.addEventListener('DOMContentLoaded', function() {
    let contador = 0;
    const elementoContador = document.getElementById('contador');
    const btnIncrementar = document.getElementById('btn-incrementar');
    const btnDisminuir = document.getElementById('btn-disminuir');
    
    function actualizarContador() {
        elementoContador.textContent = contador;
        
        // Cambiar color según el valor
        if (contador > 0) {
            elementoContador.style.color = '#2ecc71';
        } else if (contador < 0) {
            elementoContador.style.color = '#e74c3c';
        } else {
            elementoContador.style.color = '#e74c3c';
        }
    }
    
    btnIncrementar.addEventListener('click', function() {
        contador++;
        actualizarContador();
    });
    
    btnDisminuir.addEventListener('click', function() {
        contador--;
        actualizarContador();
    });
    
    // Inicializar contador
    actualizarContador();
});