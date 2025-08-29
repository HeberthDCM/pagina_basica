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
    if (!selector) return;
    
    // Limpiar selector
    selector.innerHTML = '<option value="">Seleccione un curso</option>';
    
    // Agregar opciones
    cursos.forEach(curso => {
        const option = document.createElement('option');
        option.value = curso.CodigoCurso;
        option.textContent = `${curso.NombreCurso} - Clase ${curso.NumeroClase}`;
        selector.appendChild(option);
    });
    
    // Establecer el evento change
    selector.addEventListener('change', function() {
        cursoSeleccionado = cursos.find(c => c.CodigoCurso === this.value);
    });
}

// Función para agregar un número al código
function agregarNumero(numero) {
    codigoIngresado += numero;
    actualizarDisplayCodigo();
}

// Función para borrar el código
function borrarCodigo() {
    codigoIngresado = '';
    actualizarDisplayCodigo();
}

// Función para actualizar el display del código
function actualizarDisplayCodigo() {
    const display = document.getElementById('display-codigo');
    if (display) {
        display.textContent = codigoIngresado;
    }
}

// Función para registrar asistencia
async function registrarAsistencia() {
    if (!cursoSeleccionado) {
        mostrarMensaje('Por favor, seleccione un curso primero.', 'error');
        return;
    }
    
    if (!codigoIngresado) {
        mostrarMensaje('Por favor, ingrese un código de estudiante.', 'error');
        return;
    }
    
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
    
    // Verificar si es tardanza
    const horaInicio = cursoSeleccionado.HoraInicio;
    const horaTolerancia = cursoSeleccionado.HoraTolerancia;
    const horaTardanza = cursoSeleccionado.HoraTardanza;
    
    // Crear objeto de asistencia
    const registroAsistencia = {
        CodigoEstudiante: estudiante.CodigoEstudiante,
        Promocion: estudiante.Promocion,
        FechaMarca: fechaMarca,
        HoraMarca: horaMarca,
        NombreCurso: cursoSeleccionado.NombreCurso,
        Estado: calcularEstadoAsistencia(horaMarca, horaInicio, horaTolerancia, horaTardanza)
    };
    
    // Guardar en el archivo de asistencia
    try {
        await guardarAsistencia(registroAsistencia);
        
        // Mostrar mensaje de éxito
        mostrarMensaje(`Bienvenido ${estudiante.Nombres} ${estudiante.Apellidos}`, 'exito');
        
        // Mostrar fotografía
        mostrarFotoEstudiante(estudiante.CodigoEstudiante);
        
        // Preparar para siguiente registro después de un tiempo
        setTimeout(() => {
            codigoIngresado = '';
            actualizarDisplayCodigo();
            ocultarMensaje();
            ocultarFoto();
        }, 3000);
        
    } catch (error) {
        console.error('Error al guardar la asistencia:', error);
        mostrarMensaje('Error al registrar la asistencia.', 'error');
    }
}

// Función para calcular el estado de asistencia
function calcularEstadoAsistencia(horaMarca, horaInicio, horaTolerancia, horaTardanza) {
    const marca = new Date(`2000-01-01T${horaMarca}`);
    const inicio = new Date(`2000-01-01T${horaInicio}`);
    const tolerancia = new Date(`2000-01-01T${horaTolerancia}`);
    const tardanza = new Date(`2000-01-01T${horaTardanza}`);
    
    if (marca <= tolerancia) return 'Puntual';
    if (marca <= tardanza) return 'Tardanza';
    return 'Ausente';
}

// Función para guardar asistencia en Excel
async function guardarAsistencia(registro) {
    try {
        // Cargar archivo existente o crear uno nuevo
        let workbook;
        let worksheet;
        let datosExistentes = [];
        
        try {
            const respuesta = await fetch('data/Asistencia.xlsx');
            const arrayBuffer = await respuesta.arrayBuffer();
            workbook = XLSX.read(arrayBuffer);
            worksheet = workbook.Sheets[workbook.SheetNames[0]];
            datosExistentes = XLSX.utils.sheet_to_json(worksheet);
        } catch (error) {
            // Si el archivo no existe, crear uno nuevo
            workbook = XLSX.utils.book_new();
            worksheet = XLSX.utils.json_to_sheet([]);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Asistencia');
        }
        
        // Agregar nuevo registro
        datosExistentes.push(registro);
        
        // Convertir a hoja de cálculo
        const nuevaWorksheet = XLSX.utils.json_to_sheet(datosExistentes);
        
        // Actualizar workbook
        workbook.Sheets[workbook.SheetNames[0]] = nuevaWorksheet;
        
        // Guardar archivo (esto normalmente requeriría un backend)
        // En un entorno real, esto se haría con una petición al servidor
        console.log('Registro de asistencia:', registro);
        
        // Simular guardado exitoso
        return true;
        
    } catch (error) {
        console.error('Error al guardar asistencia:', error);
        throw error;
    }
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
        fotoDiv.src = `fotos/${codigoEstudiante}.jpg`;
        fotoDiv.style.display = 'block';
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
    if (!teclado) return;
    
    // Crear botones del 1 al 9
    for (let i = 1; i <= 9; i++) {
        const boton = document.createElement('div');
        boton.className = 'tecla';
        boton.textContent = i;
        boton.onclick = () => agregarNumero(i.toString());
        teclado.appendChild(boton);
    }
    
    // Botón de borrar
    const botonBorrar = document.createElement('div');
    botonBorrar.className = 'tecla tecla-borrar';
    botonBorrar.textContent = 'Borrar';
    botonBorrar.onclick = borrarCodigo;
    teclado.appendChild(botonBorrar);
    
    // Botón 0
    const botonCero = document.createElement('div');
    botonCero.className = 'tecla';
    botonCero.textContent = '0';
    botonCero.onclick = () => agregarNumero('0');
    teclado.appendChild(botonCero);
    
    // Botón de registrar
    const botonRegistrar = document.createElement('div');
    botonRegistrar.className = 'tecla tecla-registrar';
    botonRegistrar.textContent = 'Registrar';
    botonRegistrar.onclick = registrarAsistencia;
    teclado.appendChild(botonRegistrar);
}

// Inicializar la página
function inicializarPagina1() {
    iniciarReloj();
    cargarDatosExcel();
    crearTecladoNumerico();
    
    // Inicializar el display del código
    actualizarDisplayCodigo();
}

// Llamar a la inicialización cuando se cargue la página
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si estamos en la página 1
    if (document.getElementById('content').innerHTML.includes('page-content')) {
        inicializarPagina1();
    }
});

// Para cargar desde script.js
if (typeof iniciarReloj === 'function') {
    iniciarReloj();
}