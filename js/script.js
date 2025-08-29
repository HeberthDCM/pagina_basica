// Cargar contenido inicial
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si había un estado guardado para el menú
    const menuState = localStorage.getItem('menuMinimized');
    if (menuState === 'true') {
        minimizeMenu();
    }
    
    cargarPagina('pagina1');
    
    // Añadir event listeners a los enlaces del menú
    document.querySelectorAll('.menu a').forEach(enlace => {
        enlace.addEventListener('click', function(e) {
            e.preventDefault();
            const pagina = this.getAttribute('data-page');
            
            // Actualizar clase activa
            document.querySelectorAll('.menu a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');
            
            // Cargar la página seleccionada
            cargarPagina(pagina);
        });
    });
    
    // Configurar el botón de toggle
    const toggleBtn = document.getElementById('toggleBtn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleMenu);
    }
});

// Función para alternar el menú
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    if (sidebar.classList.contains('minimized')) {
        expandMenu();
    } else {
        minimizeMenu();
    }
}

// Minimizar el menú
function minimizeMenu() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    sidebar.classList.add('minimized');
    mainContent.style.marginLeft = '60px';
    
    // Guardar estado en localStorage
    localStorage.setItem('menuMinimized', 'true');
}

// Expandir el menú
function expandMenu() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    sidebar.classList.remove('minimized');
    
    if (window.innerWidth > 768) {
        mainContent.style.marginLeft = '250px';
    } else {
        mainContent.style.marginLeft = '60px';
    }
    
    // Guardar estado en localStorage
    localStorage.setItem('menuMinimized', 'false');
}

// Función para cargar páginas
function cargarPagina(pagina) {
    fetch(`pages/${pagina}.html`)
        .then(response => response.text())
        .then(html => {
            document.getElementById('content').innerHTML = html;
            
            // Cargar CSS específico de la página
            const existingPageStyle = document.getElementById('page-specific-css');
            if (existingPageStyle) {
                existingPageStyle.remove();
            }
            
            const link = document.createElement('link');
            link.id = 'page-specific-css';
            link.rel = 'stylesheet';
            link.href = `css/${pagina}.css`;
            document.head.appendChild(link);
            
            // Cargar JS específico de la página
            const existingPageScript = document.getElementById('page-specific-js');
            if (existingPageScript) {
                existingPageScript.remove();
            }
            
            const script = document.createElement('script');
            script.id = 'page-specific-js';
            script.src = `js/${pagina}.js`;
            
            // Añadir evento para cuando el script se cargue correctamente
            script.onload = function() {
                // Ejecutar la función iniciarReloj si existe
                if (typeof iniciarReloj === 'function') {
                    iniciarReloj();
                }
            };
            
            document.body.appendChild(script);
        })
        .catch(error => {
            console.error('Error al cargar la página:', error);
            document.getElementById('content').innerHTML = `
                <div class="error">
                    <h2>Error al cargar la página</h2>
                    <p>Por favor, intenta nuevamente.</p>
                </div>
            `;
        });
}

// Ajustar el menú cuando cambia el tamaño de la ventana
window.addEventListener('resize', function() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    if (window.innerWidth <= 768) {
        // En móviles, el menú siempre está minimizado por defecto
        if (!sidebar.classList.contains('minimized')) {
            mainContent.style.marginLeft = '250px';
        } else {
            mainContent.style.marginLeft = '60px';
        }
    } else {
        // En escritorio, ajustar según el estado del menú
        if (sidebar.classList.contains('minimized')) {
            mainContent.style.marginLeft = '60px';
        } else {
            mainContent.style.marginLeft = '250px';
        }
    }
});