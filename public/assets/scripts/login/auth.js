// auth.js - Manejo de autenticación en login.html

// Usuarios de prueba por defecto
const defaultUsers = [
    { id: "u1", name: "María Gómez", email: "docente@demo.com", password: "123456", role: "teacher", level: "Secundaria", department: "Matemáticas", active: true, verified: true },
    { id: "u2", name: "Carlos Ruiz", email: "directivo@demo.com", password: "123456", role: "director", level: null, department: null, active: true, verified: true, institutionConfig: { alertThreshold: 40 } }
];

let appData = {
    users: [],
    currentUser: null
};

// Cargar usuarios desde localStorage o inicializar con defaults
function loadUsersFromStorage() {
    const stored = localStorage.getItem('teacherEmotionalData');

    if (stored) {
        try {
            const data = JSON.parse(stored);
            if (data.users && data.users.length > 0) {
                appData.users = data.users;
            } else {
                // Si no hay usuarios en el almacenamiento, usar defaults
                appData.users = [...defaultUsers];
                saveUsersToStorage();
            }
        } catch (e) {
            appData.users = [...defaultUsers];
            saveUsersToStorage();
        }
    } else {
        // Primera vez: guardar defaults
        appData.users = [...defaultUsers];
        saveUsersToStorage();
    }

    // Asegurar que los usuarios de prueba estén presentes
    ensureDefaultUsersExist();
}

// Guardar usuarios en localStorage
function saveUsersToStorage() {
    let stored = localStorage.getItem('teacherEmotionalData');
    let data = stored ? JSON.parse(stored) : { emotionalRecords: [], favoriteResources: {}, auditLog: [] };
    data.users = appData.users;
    localStorage.setItem('teacherEmotionalData', JSON.stringify(data));
}

// Verificar que los usuarios de prueba existan y agregarlos si faltan
function ensureDefaultUsersExist() {
    let changed = false;
    defaultUsers.forEach(defaultUser => {
        const exists = appData.users.some(u => u.email === defaultUser.email);
        if (!exists) {
            appData.users.push({ ...defaultUser });
            changed = true;
        }
    });
    if (changed) {
        saveUsersToStorage();
    }
}

function login(email, password, remember) {
    // Asegurar que los usuarios de prueba estén cargados
    ensureDefaultUsersExist();

    console.log('Usuarios disponibles:', appData.users.map(u => `${u.email} (${u.role})`));
    console.log('Intentando login con:', email, password);

    const user = appData.users.find(u => u.email === email && u.password === password && u.active);
    if (user) {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        if (remember) {
            localStorage.setItem('rememberedUser', JSON.stringify({ email, password }));
        } else {
            localStorage.removeItem('rememberedUser');
        }
        return user;
    }
    return null;
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function showMessage(message, isError = true) {
    const msgDiv = document.getElementById('authMessage');
    if (msgDiv) {
        msgDiv.textContent = message;
        msgDiv.className = `auth-message ${isError ? 'error' : 'success'}`;
        msgDiv.style.display = 'block';
        setTimeout(() => {
            msgDiv.style.display = 'none';
        }, 5000);
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    loadUsersFromStorage();

    // Mostrar en consola los usuarios disponibles para depuración
    console.log('Usuarios cargados:', appData.users.map(u => u.email));

    // Formulario de login
    const loginForm = document.getElementById('loginForm');
    const btnLogin = document.getElementById('btnLogin');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const remember = document.getElementById('rememberMe').checked;

        if (!email || !password) {
            showMessage('Por favor completa todos los campos', true);
            return;
        }

        btnLogin.classList.add('loading');

        setTimeout(() => {
            const user = login(email, password, remember);
            btnLogin.classList.remove('loading');
            if (user) {
                showMessage('Inicio de sesión exitoso. Redirigiendo...', false);
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                showMessage('Correo o contraseña incorrectos', true);
            }
        }, 500);
    });

    // Mostrar/ocultar contraseña
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling;
            if (input && input.type) {
                input.type = input.type === 'password' ? 'text' : 'password';
                const icon = btn.querySelector('i');
                if (icon) {
                    icon.classList.toggle('ri-eye-line');
                    icon.classList.toggle('ri-eye-off-line');
                }
            }
        });
    });

    // Social login simulado
    document.getElementById('googleLoginBtn')?.addEventListener('click', () => {
        showMessage('Inicio con Google (demo) - Usa docente@demo.com / 123456', false);
    });
    document.getElementById('facebookLoginBtn')?.addEventListener('click', () => {
        showMessage('Inicio con Facebook (demo) - Usa directivo@demo.com / 123456', false);
    });
});