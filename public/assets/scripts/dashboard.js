// dashboard.js - Lógica del dashboard con sidebar y carga de vistas

const VIEWS_PATH = 'public/views/';

// Mapeo de vistas según el rol y el ID del menú
const viewConfig = {
    teacher: {
        menu: [
            { id: 'teacher-home', icon: 'ri-home-line', label: 'Inicio' },
            { id: 'teacher-emotion', icon: 'ri-emotion-line', label: 'Registro emocional' },
            { id: 'teacher-history', icon: 'ri-history-line', label: 'Mi historial' },
            { id: 'library', icon: 'ri-book-open-line', label: 'Biblioteca' },
            { id: 'community', icon: 'ri-group-line', label: 'Comunidad' }
        ],
        defaultView: 'teacher-home',
        titles: {
            'teacher-home': 'Mi Panel',
            'teacher-emotion': 'Registro emocional',
            'teacher-history': 'Mi historial',
            'library': 'Biblioteca de bienestar',
            'community': 'Comunidad'
        }
    },
    director: {
        menu: [
            { id: 'director-analytics', icon: 'ri-bar-chart-line', label: 'Analítica' },
            { id: 'director-users', icon: 'ri-user-settings-line', label: 'Gestión usuarios' },
            { id: 'director-config', icon: 'ri-building-line', label: 'Configuración' },
            { id: 'director-alerts', icon: 'ri-notification-3-line', label: 'Alertas' },
            { id: 'library', icon: 'ri-book-open-line', label: 'Biblioteca' },
            { id: 'community', icon: 'ri-group-line', label: 'Comunidad' }
        ],
        defaultView: 'director-analytics',
        titles: {
            'director-analytics': 'Analítica institucional',
            'director-users': 'Gestión de usuarios',
            'director-config': 'Configuración',
            'director-alerts': 'Alertas',
            'library': 'Biblioteca de bienestar',
            'community': 'Comunidad'
        }
    }
};

// Obtener el usuario actual desde sessionStorage
function getCurrentUser() {
    const userJson = sessionStorage.getItem('currentUser');
    if (!userJson) return null;
    try {
        return JSON.parse(userJson);
    } catch (e) {
        return null;
    }
}

// Cerrar sesión
function logout() {
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('rememberedUser');
    window.location.href = 'login.html';
}

// Mostrar toast
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Cargar una vista
function loadView(viewId) {
    const content = document.getElementById('dynamicContent');
    const titleEl = document.getElementById('currentViewTitle');
    const user = getCurrentUser();
    if (!user) return;

    // Actualizar título
    const roleConfig = viewConfig[user.role] || viewConfig.teacher;
    titleEl.textContent = roleConfig.titles[viewId] || viewId;

    // Mostrar loader
    content.innerHTML = `
        <div class="loading-spinner">
            <i class="ri-loader-4-line ri-spin"></i>
            <p>Cargando...</p>
        </div>
    `;

    // Buscar el archivo de la vista
    const viewFile = `${VIEWS_PATH}${viewId}.html`;

    fetch(viewFile)
        .then(response => {
            if (!response.ok) {
                throw new Error(`No se pudo cargar la vista: ${viewId}`);
            }
            return response.text();
        })
        .then(html => {
            // Crear un contenedor temporal para parsear el HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;

            // Extraer scripts con src (externos) y scripts inline
            const externalScripts = [];
            const inlineScripts = [];
            const scriptElements = tempDiv.querySelectorAll('script');

            scriptElements.forEach(script => {
                if (script.src) {
                    // Guardar la URL del script externo
                    externalScripts.push(script.src);
                } else {
                    // Guardar el contenido inline
                    inlineScripts.push(script.textContent);
                }
                // Eliminar el script del HTML para evitar que se ejecute al insertarlo
                script.remove();
            });

            // El HTML restante (sin scripts) se inyecta
            content.innerHTML = tempDiv.innerHTML;

            // Función para ejecutar scripts inline
            function executeInlineScripts() {
                inlineScripts.forEach(code => {
                    const script = document.createElement('script');
                    script.textContent = code;
                    document.body.appendChild(script);
                    // Opcional: eliminar el script después de ejecutarlo
                    // script.remove();
                });
            }

            // Función para cargar scripts externos secuencialmente
            function loadExternalScripts(index = 0) {
                if (index >= externalScripts.length) {
                    // Todos los scripts externos cargados, ahora ejecutar inline y disparar evento
                    executeInlineScripts();
                    document.dispatchEvent(new CustomEvent('viewLoaded', { detail: { viewId } }));
                    return;
                }

                const src = externalScripts[index];
                const script = document.createElement('script');
                script.src = src;
                script.onload = () => {
                    // Cargar el siguiente script
                    loadExternalScripts(index + 1);
                };
                script.onerror = () => {
                    console.warn(`Error cargando script: ${src}`);
                    // Continuar con el siguiente de todas formas
                    loadExternalScripts(index + 1);
                };
                document.body.appendChild(script);
            }

            // Si no hay scripts externos, ejecutar inline y disparar evento inmediatamente
            if (externalScripts.length === 0) {
                executeInlineScripts();
                document.dispatchEvent(new CustomEvent('viewLoaded', { detail: { viewId } }));
            } else {
                // Cargar scripts externos
                loadExternalScripts();
            }
        })
        .catch(error => {
            console.error('Error cargando vista:', error);
            content.innerHTML = `
                <div class="data-card error-view">
                    <i class="ri-error-warning-line" style="font-size:3rem;color:var(--secondary-warm);"></i>
                    <h3>Vista no disponible</h3>
                    <p>No pudimos cargar el contenido solicitado. Intenta de nuevo más tarde.</p>
                    <p class="text-help">Error: ${error.message}</p>
                </div>
            `;
            showToast('Error al cargar la vista', 'error');
        });
}

// Generar el menú en el sidebar
function buildSidebar() {
    const user = getCurrentUser();
    if (!user) return;

    const roleConfig = viewConfig[user.role] || viewConfig.teacher;
    const nav = document.getElementById('sidebarNav');
    nav.innerHTML = '';

    roleConfig.menu.forEach(item => {
        const a = document.createElement('a');
        a.href = '#';
        a.className = 'sidebar-item';
        a.dataset.view = item.id;
        a.innerHTML = `<i class="${item.icon}"></i><span>${item.label}</span>`;
        a.addEventListener('click', (e) => {
            e.preventDefault();
            // Marcar como activo
            document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
            a.classList.add('active');
            loadView(item.id);
        });
        nav.appendChild(a);
    });

    // Cargar la vista por defecto
    const defaultView = roleConfig.defaultView;
    const defaultItem = nav.querySelector(`[data-view="${defaultView}"]`);
    if (defaultItem) defaultItem.classList.add('active');
    loadView(defaultView);
}

// Inicializar el dashboard
function initDashboard() {
    const user = getCurrentUser();
    if (!user) {
        // Si no hay sesión, redirigir al login
        window.location.href = 'login.html';
        return;
    }

    // Actualizar información del usuario en el sidebar
    document.getElementById('sidebarUserName').textContent = user.name;
    document.getElementById('sidebarUserRole').textContent = user.role === 'teacher' ? 'Docente' : 'Directivo';
    document.getElementById('topbarUserGreeting').textContent = `Hola, ${user.name}`;

    // Construir el menú y cargar la vista inicial
    buildSidebar();

    // Evento para cerrar sesión
    document.getElementById('sidebarLogoutBtn').addEventListener('click', () => {
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            logout();
        }
    });

    // Toggle sidebar en móvil
    document.getElementById('mobileSidebarToggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('open');
    });

    // Cerrar sidebar al hacer clic fuera en móvil
    document.addEventListener('click', (e) => {
        const sidebar = document.getElementById('sidebar');
        const toggleBtn = document.getElementById('mobileSidebarToggle');
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initDashboard);