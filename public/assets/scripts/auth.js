
// auth.js - Manejo de autenticación en login.html

// Datos de usuarios de ejemplo (debe coincidir con teacher.js)
const defaultUsers = [
    { id: "u1", name: "María Gómez", email: "docente@demo.com", password: "123456", role: "teacher", level: "Secundaria", department: "Matemáticas", active: true, verified: true },
    { id: "u2", name: "Carlos Ruiz", email: "directivo@demo.com", password: "123456", role: "director", level: null, department: null, active: true, verified: true, institutionConfig: { alertThreshold: 40 } }
];

let appData = {
    users: [...defaultUsers],
    currentUser: null
};

function loadUsersFromStorage() {
    const stored = localStorage.getItem('teacherEmotionalData');
    if (stored) {
        const data = JSON.parse(stored);
        if (data.users) appData.users = data.users;
    }
}

function saveUserToStorage(user) {
    let stored = localStorage.getItem('teacherEmotionalData');
    let data = stored ? JSON.parse(stored) : { users: defaultUsers, emotionalRecords: [], favoriteResources: {}, auditLog: [] };
    // Si el usuario no existe, añadirlo
    const existing = data.users.find(u => u.id === user.id);
    if (!existing) {
        data.users.push(user);
        localStorage.setItem('teacherEmotionalData', JSON.stringify(data));
    }
}

function login(email, password, remember) {
    const user = appData.users.find(u => u.email === email && u.password === password && u.active);
    if (user) {
        // Guardar sesión
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

function registerUser(userData) {
    if (appData.users.find(u => u.email === userData.email)) {
        return { success: false, message: "El correo ya está registrado" };
    }
    const newUser = {
        id: Date.now() + '-' + Math.random().toString(36).substr(2, 6),
        name: `${userData.name} ${userData.lastname}`,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        active: true,
        verified: false,
        level: userData.role === 'teacher' ? 'Secundaria' : null,
        department: null
    };
    appData.users.push(newUser);
    saveUserToStorage(newUser);
    // Actualizar institución si es director
    if (userData.role === 'director' && userData.institution) {
        let stored = localStorage.getItem('teacherEmotionalData');
        let data = stored ? JSON.parse(stored) : {};
        data.institution = data.institution || { name: userData.institution, logo: "https://i.imgur.com/32rW4mJ.png", levels: ["Inicial","Primaria","Secundaria"], departments: ["Matemáticas","Comunicación","Ciencias"] };
        localStorage.setItem('teacherEmotionalData', JSON.stringify(data));
    }
    return { success: true, message: "Cuenta creada. Ahora puedes iniciar sesión" };
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
        setTimeout(() => {
            msgDiv.style.display = 'none';
        }, 5000);
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    loadUsersFromStorage();

    // Formulario de login
    const loginForm = document.getElementById('loginForm');
    const btnLogin = document.getElementById('btnLogin');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const remember = document.getElementById('rememberMe').checked;
        
        // Validaciones básicas
        if (!email || !password) {
            showMessage('Por favor completa todos los campos', true);
            return;
        }
        
        btnLogin.classList.add('loading');
        
        // Simular pequeño retraso
        setTimeout(() => {
            const user = login(email, password, remember);
            btnLogin.classList.remove('loading');
            if (user) {
                showMessage('Inicio de sesión exitoso. Redirigiendo...', false);
                setTimeout(() => {
                    window.location.href = 'index.html';
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
    
    // Modal de registro
    const registerModal = document.getElementById('registerModal');
    const showRegisterBtn = document.getElementById('showRegister');
    const closeRegister = document.getElementById('closeRegister');
    const showLoginFromRegister = document.getElementById('showLoginFromRegister');
    const regRole = document.getElementById('regRoleModal');
    const institutionField = document.getElementById('institutionFieldModal');
    
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            registerModal.style.display = 'flex';
        });
    }
    if (closeRegister) closeRegister.onclick = () => registerModal.style.display = 'none';
    if (showLoginFromRegister) {
        showLoginFromRegister.addEventListener('click', (e) => {
            e.preventDefault();
            registerModal.style.display = 'none';
        });
    }
    if (regRole) {
        regRole.addEventListener('change', () => {
            institutionField.style.display = regRole.value === 'director' ? 'block' : 'none';
        });
    }
    
    // Formulario de registro
    const registerForm = document.getElementById('registerFormModal');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userData = {
                name: document.getElementById('regNameModal').value,
                lastname: document.getElementById('regLastnameModal').value,
                email: document.getElementById('regEmailModal').value,
                password: document.getElementById('regPasswordModal').value,
                role: document.getElementById('regRoleModal').value,
                institution: document.getElementById('regInstitutionModal')?.value || ''
            };
            const result = registerUser(userData);
            if (result.success) {
                showMessage(result.message, false);
                registerModal.style.display = 'none';
                // Limpiar formulario
                registerForm.reset();
            } else {
                showMessage(result.message, true);
            }
        });
    }
    
    // Modal de recuperación
    const forgotModal = document.getElementById('forgotModal');
    const forgotLink = document.getElementById('forgotPasswordLink');
    const closeForgot = document.getElementById('closeForgot');
    const backToLoginFromForgot = document.getElementById('backToLoginFromForgot');
    
    if (forgotLink) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            forgotModal.style.display = 'flex';
        });
    }
    if (closeForgot) closeForgot.onclick = () => forgotModal.style.display = 'none';
    if (backToLoginFromForgot) {
        backToLoginFromForgot.addEventListener('click', (e) => {
            e.preventDefault();
            forgotModal.style.display = 'none';
        });
    }
    
    const forgotForm = document.getElementById('forgotForm');
    if (forgotForm) {
        forgotForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('forgotEmail').value;
            showMessage(`Se ha enviado un enlace de recuperación a ${email} (simulado)`, false);
            forgotModal.style.display = 'none';
        });
    }
    
    // Social login simulado
    document.getElementById('googleLoginBtn')?.addEventListener('click', () => {
        showMessage('Inicio con Google (demo) - Usa docente@demo.com / 123456', false);
    });
    document.getElementById('facebookLoginBtn')?.addEventListener('click', () => {
        showMessage('Inicio con Facebook (demo) - Usa directivo@demo.com / 123456', false);
    });
    
    // Cerrar modales al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (e.target === registerModal) registerModal.style.display = 'none';
        if (e.target === forgotModal) forgotModal.style.display = 'none';
    });
});