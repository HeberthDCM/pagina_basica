// Variables globales
let cursos = [];
let estudiantes = [];
let codigoIngresado = '';
let cursoSeleccionado = null;

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

// Función para cargar datos de Excel
async function cargarDatosExcel() {
    try {
        // Cargar cursos
        const respuestaCursos = await fetch('data/Cursos.xlsx');
        const arrayBufferCursos = await respuestaCursos.arrayBuffer();
        const workbookCursos = XLSX.read(arrayBufferCursos);
        const primeraHojaCursos = workbookCursos.SheetNames[0];
        const worksheetCursos = workbookCursos.Sheets[primeraHojaCursos];
        cursos = XLSX.utils.sheet_to_json(worksheetCursos);
        
        // Cargar estudiantes
        const respuestaEstudiantes = await fetch('data/Estudiantes.xlsx');
        const arrayBufferEstudiantes = await respuestaEstudiantes.arrayBuffer();
        const workbookEstudiantes = XLSX.read(arrayBufferEstudiantes);
        const primeraHojaEstudiantes = workbookEstudiantes.SheetNames[0];
        const worksheetEstudiantes = workbookEstudiantes.Sheets[primeraHojaEstudiantes];
        estudiantes = XLSX.utils.sheet_to_json(worksheetEstudiantes);
        
        console.log('Datos cargados:', { cursos, estudiantes });
        
        // Llenar el selector de cursos
        llenarSelectorCursos();
        
    } catch (error) {
        console.error('Error al cargar los archivos Excel:', error);
        mostrarMensaje('Error al cargar los datos. Asegúrese de que los archivos existan.', 'error');
    }
}

// Función para llenar el selector de cursos
function llenarSelectorCursos() {
    const selector = document.getElementById('selector-curso');
    if (!selector) {
        console.error('No se encontró el selector de cursos');
        return;
    }
    
    // Limpiar selector
    selector.innerHTML = '<option value="">Seleccione un curso</option>';
    
    // Agregar opciones
    cursos.forEach(curso => {
        const option = document.createElement('option');
        option.value = curso.CodigoCurso;
        option.textContent = `${curso.NombreCurso} - Clase ${curso.NumeroClase}`;
        option.setAttribute('data-curso', JSON.stringify(curso));
        selector.appendChild(option);
    });
    
    // Establecer el evento change
    selector.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        if (selectedOption.value) {
            cursoSeleccionado = JSON.parse(selectedOption.getAttribute('data-curso'));
            console.log('Curso seleccionado:', cursoSeleccionado);
        } else {
            cursoSeleccionado = null;
        }
    });
}

// Función para agregar un número al código
function agregarNumero(numero) {
    codigoIngresado += numero;
    console.log("digito",codigoIngresado);
    actualizarDisplayCodigo();
    
}

// Función para borrar el código
function borrarCodigo() {
    codigoIngresado = '';
    console.log("Borrar codigo","1");
    actualizarDisplayCodigo();
}

// Función para actualizar el display del código
function actualizarDisplayCodigo() {
    const display = document.getElementById('display-codigo');
    if (display) {
        display.textContent = codigoIngresado || '---';
    }
    console.log("digitoactualizar","2");
}

// Función para registrar asistencia
async function registrarAsistencia() {
    if (!cursoSeleccionado) {
        mostrarMensaje('Por favor, seleccione un curso primero.', 'error');
        alert("1");
        return;
    }
    
    if (!codigoIngresado) {
        mostrarMensaje('Por favor, ingrese un código de estudiante.', 'error');
        return;
    }
    
    console.log("Codigo ingresado",codigoIngresado);
    // Buscar estudiante
    const estudiante = estudiantes.find(e => e.CodigoEstudiante == codigoIngresado);
    
    if (!estudiante) {
        mostrarMensaje('Código de estudiante no encontrado.', 'error');
        return;
    }

    // Obtener fecha y hora actual
    const ahora = new Date();
    const fechaMarca = ahora.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const horaMarca = ahora.toTimeString().split(' ')[0]; // Formato HH:MM:SS
    console.log("Hora1",ahora);
    console.log("Hora2",fechaMarca);
    console.log("Hora3",horaMarca);
    // Verificar si es tardanza




    const estado = calcularEstadoAsistencia(horaMarca, cursoSeleccionado.HoraInicio, 
                                          cursoSeleccionado.HoraTolerancia, cursoSeleccionado.HoraTardanza);
    
    // Crear objeto de asistencia
    const registroAsistencia = {
        CodigoEstudiante: estudiante.CodigoEstudiante,
        Promocion: estudiante.Promocion,
        FechaMarca: fechaMarca,
        HoraMarca: horaMarca,
        NombreCurso: cursoSeleccionado.NombreCurso,
        Estado: estado

    };
    console.log("Registro",registroAsistencia);
    
    // Mostrar mensaje de éxito
    mostrarMensaje(`¡Bienvenido ${estudiante.Nombres} ${estudiante.Apellidos}! (${estado})`, 'exito');
    
    // Mostrar fotografía
    mostrarFotoEstudiante(estudiante.CodigoEstudiante);
    
    // Simular guardado en Excel (en un caso real se enviaría a un backend)
    console.log('Registro de asistencia:', registroAsistencia);
    
    // Preparar para siguiente registro después de un tiempo
    setTimeout(() => {
        codigoIngresado = '';
        actualizarDisplayCodigo();
        ocultarMensaje();
        ocultarFoto();
    }, 4000);
}

// Función para calcular el estado de asistencia
function calcularEstadoAsistencia(horaMarca, horaInicio, horaTolerancia, horaTardanza) {
    // Convertir a minutos para facilitar comparación
    const [hMarca, mMarca] = horaMarca.split(':').map(Number);
    const minutosMarca = hMarca * 60 + mMarca;
    
    const [hInicio, mInicio] = horaInicio.split(':').map(Number);
    const minutosInicio = hInicio * 60 + mInicio;
    
    const [hTolerancia, mTolerancia] = horaTolerancia.split(':').map(Number);
    const minutosTolerancia = hTolerancia * 60 + mTolerancia;
    
    const [hTardanza, mTardanza] = horaTardanza.split(':').map(Number);
    const minutosTardanza = hTardanza * 60 + mTardanza;
    
    if (minutosMarca <= minutosTolerancia) return 'Puntual';
    if (minutosMarca <= minutosTardanza) return 'Tardanza';
    return 'Ausente';
}

// Función para mostrar mensaje
function mostrarMensaje(mensaje, tipo) {
    const mensajeDiv = document.getElementById('mensaje-resultado');
    const mensajeTexto = document.getElementById('texto-mensaje');
    
    if (mensajeDiv && mensajeTexto) {
        mensajeTexto.textContent = mensaje;
        mensajeDiv.className = `mensaje-resultado mensaje-${tipo}`;
        mensajeDiv.style.display = 'block';
    }
}

// Función para ocultar mensaje
function ocultarMensaje() {
    const mensajeDiv = document.getElementById('mensaje-resultado');
    if (mensajeDiv) {
        mensajeDiv.style.display = 'none';
    }
}

// Función para mostrar foto del estudiante
function mostrarFotoEstudiante(codigoEstudiante) {
    const fotoDiv = document.getElementById('foto-estudiante');
    if (fotoDiv) {
        // Ruta relativa a la carpeta de fotos
        fotoDiv.src = `fotos/${codigoEstudiante}.jpg`;
        fotoDiv.style.display = 'block';
        
        // Manejar error si la imagen no existe
        fotoDiv.onerror = function() {
            this.style.display = 'none';
        };
    }
}

// Función para ocultar foto
function ocultarFoto() {
    const fotoDiv = document.getElementById('foto-estudiante');
    if (fotoDiv) {
        fotoDiv.style.display = 'none';
    }
}

// Función para crear teclado numérico
function crearTecladoNumerico() {
    const teclado = document.getElementById('teclado-numerico');
    if (!teclado) {
        console.error('No se encontró el elemento teclado-numerico');
        return;
    }
    
    // Limpiar teclado existente
    teclado.innerHTML = '';
    
    // Crear botones del 1 al 9
    for (let i = 1; i <= 9; i++) {
        const boton = document.createElement('button');
        boton.className = 'tecla';
        boton.textContent = i;
        boton.onclick = () => agregarNumero(i.toString());
        teclado.appendChild(boton);
    }
    
    // Botón de borrar
    const botonBorrar = document.createElement('button');
    botonBorrar.className = 'tecla tecla-borrar';
    botonBorrar.textContent = 'Borrar';
    botonBorrar.onclick = borrarCodigo;
    teclado.appendChild(botonBorrar);
    
    // Botón 0
    const botonCero = document.createElement('button');
    botonCero.className = 'tecla';
    botonCero.textContent = '0';
    botonCero.onclick = () => agregarNumero('0');
    teclado.appendChild(botonCero);
    
    // Botón de registrar
    const botonRegistrar = document.createElement('button');
    botonRegistrar.className = 'tecla tecla-registrar';
    botonRegistrar.textContent = 'Registrar';
    botonRegistrar.onclick = registrarAsistencia;
    teclado.appendChild(botonRegistrar);
    
    console.log('Teclado numérico creado con éxito');
}

// Inicializar la página
function inicializarPagina1() {
    console.log('Inicializando página 1');
    
    // Iniciar componentes
    iniciarReloj();
    crearTecladoNumerico();
    actualizarDisplayCodigo();
    
    // Cargar datos después de un breve delay para asegurar que el DOM esté listo
    setTimeout(() => {
        cargarDatosExcel();
    }, 100);
}

// Verificar si estamos en la página 1 y inicializar
document.addEventListener('DOMContentLoaded', function() {
    // Esperar a que el contenido se cargue completamente
    setTimeout(() => {
        const contentDiv = document.getElementById('content');
        if (contentDiv && contentDiv.querySelector('.page-content')) {
            console.log('Página 1 detectada, inicializando...');
            inicializarPagina1();
        }
    }, 500);
});

// Para cargar desde script.js
if (typeof window.iniciarReloj === 'function') {
    window.iniciarReloj();
}