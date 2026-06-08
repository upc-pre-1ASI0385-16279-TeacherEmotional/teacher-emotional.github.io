// ==================== DATOS POR DEFECTO ====================
// Al cargar la página, verificar si hay sesión activa
function checkSession() {
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser && !appData.currentUser) {
        appData.currentUser = JSON.parse(storedUser);
        showDashboard(); // muestra el dashboard en lugar de la landing
    }
}

const defaultInstitution = {
    name: "Mi Institución",
    logo: "https://i.imgur.com/32rW4mJ.png",
    levels: ["Inicial", "Primaria", "Secundaria"],
    departments: ["Matemáticas", "Comunicación", "Ciencias", "Historia"]
};

const defaultUsers = [
    { id: "u1", name: "María Gómez", email: "docente@demo.com", password: "123456", role: "teacher", level: "Secundaria", department: "Matemáticas", active: true, verified: true },
    { id: "u2", name: "Carlos Ruiz", email: "directivo@demo.com", password: "123456", role: "director", level: null, department: null, active: true, verified: true, institutionConfig: { alertThreshold: 40 } }
];

const defaultResources = [
    { id: "r1", type: "audio", title: "Respiración consciente", description: "Meditación guiada de 5 min para ansiedad", tags: ["ansiedad", "relajación"], rating: { up: 12, down: 2 }, favoritedBy: [] },
    { id: "r2", type: "video", title: "Estiramiento de cuello", description: "Pausa activa de 3 min para la oficina", tags: ["pausa", "estiramiento"], rating: { up: 8, down: 1 }, favoritedBy: [] },
    { id: "r3", type: "article", title: "Manejo del estrés en el aula", description: "Consejos prácticos para docentes", tags: ["estrés", "aula"], rating: { up: 15, down: 3 }, favoritedBy: [] },
    { id: "r4", type: "audio", title: "Mindfulness para docentes", description: "Reduce la ansiedad antes de clases", tags: ["mindfulness"], rating: { up: 10, down: 0 }, favoritedBy: [] },
    { id: "r5", type: "video", title: "Pausa activa de piernas", description: "Movilidad y energía", tags: ["pausa"], rating: { up: 6, down: 0 }, favoritedBy: [] },
    { id: "r6", type: "article", title: "Prevención del burnout", description: "Señales y autocuidado", tags: ["burnout"], rating: { up: 20, down: 2 }, favoritedBy: [] }
];

let appData = {
    institution: { ...defaultInstitution },
    users: [...defaultUsers],
    emotionalRecords: [],
    resourceRatings: {},
    favoriteResources: {},
    auditLog: [],
    currentUser: null
};

function saveToLocalStorage() {
    localStorage.setItem('teacherEmotionalData', JSON.stringify(appData));
}

function loadFromLocalStorage() {
    const stored = localStorage.getItem('teacherEmotionalData');
    if (stored) {
        appData = JSON.parse(stored);
    } else {
        const today = new Date().toISOString().slice(0,10);
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0,10);
        appData.emotionalRecords = [
            { id: "rec1", userId: "u1", date: yesterday, emoji: "😕", intensity: 4, note: "Mucha presión por reunión", tags: ["sobrecarga"], type: "inicio", timestamp: new Date(Date.now() - 86400000).toISOString() },
            { id: "rec2", userId: "u1", date: today, emoji: "🙂", intensity: 3, note: "", tags: [], type: "inicio", timestamp: new Date().toISOString() }
        ];
        saveToLocalStorage();
    }
}

function generateId() {
    return Date.now() + '-' + Math.random().toString(36).substr(2, 6);
}

function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ==================== AUTENTICACIÓN ====================
function login(email, password, remember) {
    const user = appData.users.find(u => u.email === email && u.password === password && u.active);
    if (user) {
        appData.currentUser = user;
        if (remember) localStorage.setItem('rememberedUser', JSON.stringify({ email, password }));
        else localStorage.removeItem('rememberedUser');
        showDashboard();
        return true;
    }
    return false;
}

function logout() {
    appData.currentUser = null;
    document.getElementById('landingContent').style.display = 'block';
    document.getElementById('dashboardContainer').style.display = 'none';
    document.getElementById('mainContent').scrollIntoView();
    showToast("Sesión cerrada correctamente");
}

function registerUser(userData) {
    if (appData.users.find(u => u.email === userData.email)) {
        showToast("El correo ya está registrado", "error");
        return false;
    }
    const newUser = {
        id: generateId(),
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
    if (userData.role === 'director' && userData.institution) {
        appData.institution.name = userData.institution;
    }
    appData.auditLog.push({ date: new Date().toISOString(), userId: newUser.id, action: "Registro de usuario", detail: `${newUser.name} (${newUser.role})` });
    saveToLocalStorage();
    showToast("Cuenta creada. Ahora puedes iniciar sesión", "success");
    return true;
}

// ==================== REGISTRO EMOCIONAL ====================
function getTodayRecords(userId) {
    const today = new Date().toISOString().slice(0,10);
    return appData.emotionalRecords.filter(r => r.userId === userId && r.date === today);
}

function saveEmotionalRecord(data) {
    const now = new Date();
    const dateStr = now.toISOString().slice(0,10);
    const hour = now.getHours();
    let recordType = "normal";
    const todayRecords = getTodayRecords(appData.currentUser.id);
    const hasMorning = todayRecords.some(r => r.type === "inicio");
    const hasEvening = todayRecords.some(r => r.type === "fin");
    if (!hasMorning && hour < 12) recordType = "inicio";
    else if (hasMorning && !hasEvening && hour >= 14) recordType = "fin";
    else recordType = "normal";
    const newRecord = {
        id: generateId(),
        userId: appData.currentUser.id,
        date: dateStr,
        emoji: data.emoji,
        intensity: data.intensity,
        note: data.note || "",
        tags: data.tags || [],
        type: recordType,
        timestamp: now.toISOString()
    };
    const existingIndex = appData.emotionalRecords.findIndex(r => r.userId === appData.currentUser.id && r.date === dateStr && r.type === recordType);
    if (existingIndex !== -1) appData.emotionalRecords[existingIndex] = newRecord;
    else appData.emotionalRecords.push(newRecord);
    saveToLocalStorage();
    showToast("Registro guardado ✅", "success");
    // Sugerencia de recurso si emoción negativa
    if (data.emoji === "😢" || data.emoji === "😕") {
        setTimeout(() => {
            showToast("Te recomendamos: Respiración consciente (audio)", "info");
        }, 500);
    }
    renderTeacherDashboard();
}

function getStreak(userId) {
    const records = appData.emotionalRecords.filter(r => r.userId === userId).sort((a,b)=>new Date(a.date)-new Date(b.date));
    if (!records.length) return 0;
    let streak = 1;
    let cur = new Date(records[records.length-1].date);
    for (let i=records.length-2; i>=0; i--) {
        const prev = new Date(records[i].date);
        const diff = (cur - prev) / (1000*3600*24);
        if (diff === 1) streak++;
        else if (diff > 1) break;
        cur = prev;
    }
    return streak;
}

// ==================== RENDERIZADO DE DASHBOARDS ====================
function showDashboard() {
    document.getElementById('landingContent').style.display = 'none';
    document.getElementById('dashboardContainer').style.display = 'block';
    document.getElementById('userNameDisplay').innerText = appData.currentUser.name;
    document.getElementById('institutionNameDisplay').innerText = appData.institution.name;
    document.getElementById('institutionLogo').src = appData.institution.logo;
    
    const tabsContainer = document.getElementById('roleTabs');
    const tabContent = document.getElementById('tabContent');
    if (appData.currentUser.role === 'teacher') {
        tabsContainer.innerHTML = `<button class="tab-btn active" data-tab="teacher-main">Mi Bienestar</button>
                                    <button class="tab-btn" data-tab="resources">Biblioteca</button>`;
        renderTeacherDashboard();
    } else {
        tabsContainer.innerHTML = `<button class="tab-btn active" data-tab="analytics">Analítica</button>
                                    <button class="tab-btn" data-tab="user-management">Gestión Usuarios</button>
                                    <button class="tab-btn" data-tab="institution-settings">Configuración</button>
                                    <button class="tab-btn" data-tab="alerts-config">Alertas</button>`;
        renderDirectorDashboard();
    }
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const tab = btn.dataset.tab;
            if (appData.currentUser.role === 'teacher') {
                if (tab === 'teacher-main') renderTeacherDashboard();
                else renderResourcesView();
            } else {
                if (tab === 'analytics') renderDirectorDashboard();
                else if (tab === 'user-management') renderUserManagement();
                else if (tab === 'institution-settings') renderInstitutionSettings();
                else if (tab === 'alerts-config') renderAlertsConfig();
            }
        });
    });
}

function renderTeacherDashboard() {
    const container = document.getElementById('tabContent');
    const streak = getStreak(appData.currentUser.id);
    const lastRecords = appData.emotionalRecords.filter(r => r.userId === appData.currentUser.id).slice(-5).reverse();
    container.innerHTML = `
        <div class="data-card">
            <h3>Registro emocional de hoy</h3>
            <div class="emoji-selector" id="emojiSelector">
                <div class="emoji-option" data-emoji="😢">😢 Muy mal</div>
                <div class="emoji-option" data-emoji="😕">😕 Mal</div>
                <div class="emoji-option" data-emoji="😐">😐 Normal</div>
                <div class="emoji-option" data-emoji="🙂">🙂 Bien</div>
                <div class="emoji-option" data-emoji="😄">😄 Muy bien</div>
            </div>
            <label>Intensidad (1-5): <input type="range" id="intensitySlider" min="1" max="5" value="3"></label>
            <label>Nota opcional: <textarea id="noteText" rows="2"></textarea></label>
            <div id="etiquetasContainer" style="display:none;">
                <p>Causas de estrés:</p>
                <div class="etiquetas-group" id="etiquetasGroup">
                    <span class="etiqueta" data-tag="Sobrecarga">Sobrecarga</span>
                    <span class="etiqueta" data-tag="Conductas disruptivas">Conductas</span>
                    <span class="etiqueta" data-tag="Falta recursos">Falta recursos</span>
                </div>
            </div>
            <button id="saveEmotionBtn" class="btn btn-primary">Guardar registro</button>
        </div>
        <div class="data-card"><h3>Tu racha 🔥</h3><p style="font-size:2rem;">${streak} días</p></div>
        <div class="data-card"><h3>Últimos registros</h3><ul>${lastRecords.map(r => `<li>${r.date} - ${r.emoji} (${r.intensity}/5) ${r.note}</li>`).join('')}</ul></div>
    `;
    let selectedEmoji = null;
    let selectedTags = [];
    document.querySelectorAll('.emoji-option').forEach(el => {
        el.onclick = () => {
            document.querySelectorAll('.emoji-option').forEach(opt => opt.classList.remove('selected'));
            el.classList.add('selected');
            selectedEmoji = el.dataset.emoji;
            const etiqDiv = document.getElementById('etiquetasContainer');
            if (selectedEmoji === '😢' || selectedEmoji === '😕') etiqDiv.style.display = 'block';
            else etiqDiv.style.display = 'none';
        };
    });
    document.querySelectorAll('.etiqueta').forEach(tag => {
        tag.onclick = () => {
            tag.classList.toggle('selected');
            const val = tag.dataset.tag;
            if (selectedTags.includes(val)) selectedTags = selectedTags.filter(t => t !== val);
            else selectedTags.push(val);
        };
    });
    document.getElementById('saveEmotionBtn').onclick = () => {
        if (!selectedEmoji) { showToast("Selecciona un emoji", "error"); return; }
        const intensity = parseInt(document.getElementById('intensitySlider').value);
        const note = document.getElementById('noteText').value;
        saveEmotionalRecord({ emoji: selectedEmoji, intensity, note, tags: selectedTags });
    };
}

function renderResourcesView() {
    const container = document.getElementById('tabContent');
    container.innerHTML = `
        <div class="filters-bar">
            <input type="text" id="searchResource" placeholder="Buscar recurso...">
            <select id="typeFilter"><option value="all">Todos</option><option value="audio">Audios</option><option value="video">Videos</option><option value="article">Artículos</option></select>
        </div>
        <div id="resourcesGrid" class="card-grid"></div>
    `;
    const render = () => {
        const search = document.getElementById('searchResource').value.toLowerCase();
        const type = document.getElementById('typeFilter').value;
        let filtered = defaultResources.filter(r => r.title.toLowerCase().includes(search) && (type === 'all' || r.type === type));
        const favs = appData.favoriteResources[appData.currentUser.id] || [];
        const grid = document.getElementById('resourcesGrid');
        grid.innerHTML = filtered.map(res => `
            <div class="data-card">
                <h4>${res.title} ${favs.includes(res.id) ? '<i class="ri-heart-fill" style="color:red"></i>' : ''}</h4>
                <p>${res.description}</p>
                <button class="btn-outline fav-btn" data-id="${res.id}"><i class="ri-star-line"></i> Favorito</button>
                <button class="btn-outline view-resource" data-id="${res.id}">Ver</button>
            </div>
        `).join('');
        document.querySelectorAll('.fav-btn').forEach(btn => {
            btn.onclick = () => {
                let favs = appData.favoriteResources[appData.currentUser.id] || [];
                const rid = btn.dataset.id;
                if (favs.includes(rid)) favs = favs.filter(id => id !== rid);
                else favs.push(rid);
                appData.favoriteResources[appData.currentUser.id] = favs;
                saveToLocalStorage();
                render();
            };
        });
        document.querySelectorAll('.view-resource').forEach(btn => {
            btn.onclick = () => {
                const res = defaultResources.find(r => r.id === btn.dataset.id);
                showModal(res.title, `<p>${res.description}</p><p>Contenido de ejemplo (simulado).</p>`);
            };
        });
    };
    document.getElementById('searchResource').addEventListener('input', render);
    document.getElementById('typeFilter').addEventListener('change', render);
    render();
}

function renderDirectorDashboard() {
    const container = document.getElementById('tabContent');
    container.innerHTML = `
        <div id="alertBanner" class="alert-banner" style="display:none;">⚠️ Alerta: Alto nivel de estrés docente</div>
        <div class="filters-bar">
            <select id="levelFilter"><option value="">Todos los niveles</option>${appData.institution.levels.map(l => `<option>${l}</option>`)}</select>
            <select id="deptFilter"><option value="">Todos los departamentos</option>${appData.institution.departments.map(d => `<option>${d}</option>`)}</select>
            <button id="exportPdfBtn" class="btn-outline">Exportar PDF</button>
        </div>
        <div class="card-grid">
            <div class="data-card"><canvas id="weeklyChart"></canvas></div>
            <div class="data-card"><canvas id="monthlyChart"></canvas></div>
            <div class="data-card"><h3>Mapa de Calor (simulado)</h3><canvas id="heatmapCanvas" width="300" height="150"></canvas></div>
            <div class="data-card"><h3>Nube de Palabras</h3><div>sobrecarga reuniones padres estrés</div></div>
            <div class="data-card"><h3>Tasa participación hoy</h3><div id="participationRate">0%</div></div>
        </div>
    `;
    // Gráficos con Chart.js
    if (typeof Chart !== 'undefined') {
        new Chart(document.getElementById('weeklyChart'), { type: 'bar', data: { labels: ['Lun','Mar','Mie','Jue','Vie'], datasets: [{ label: 'Bienestar promedio', data: [3,2.5,4,3.8,2], backgroundColor: '#4f46e5' }] } });
        new Chart(document.getElementById('monthlyChart'), { type: 'line', data: { labels: Array.from({length:30},(_,i)=>i+1), datasets: [{ label: 'Promedio diario', data: Array.from({length:30},()=>Math.random()*4+1), borderColor: '#f97316' }] } });
    }
    // Tasa de participación
    const totalTeachers = appData.users.filter(u => u.role === 'teacher' && u.active).length;
    const todayRecords = appData.emotionalRecords.filter(r => r.date === new Date().toISOString().slice(0,10)).length;
    const rate = totalTeachers ? Math.round((todayRecords / totalTeachers)*100) : 0;
    document.getElementById('participationRate').innerText = `${rate}% (${todayRecords}/${totalTeachers})`;
    // Alerta roja si supera umbral
    const threshold = appData.users.find(u=>u.role==='director')?.institutionConfig?.alertThreshold || 40;
    const negativePercentage = 35; // simulado, se podría calcular
    if (negativePercentage > threshold) document.getElementById('alertBanner').style.display = 'block';
    document.getElementById('exportPdfBtn').onclick = () => showToast("PDF generado (simulado)", "info");
}

function renderUserManagement() {
    const teachers = appData.users.filter(u => u.role === 'teacher');
    const container = document.getElementById('tabContent');
    container.innerHTML = `
        <button id="addTeacherBtn" class="btn btn-primary">+ Nuevo Docente</button>
        <button id="massiveUploadBtn" class="btn-outline">Carga masiva CSV</button>
        <div class="card-grid" id="teachersList"></div>
    `;
    const listDiv = document.getElementById('teachersList');
    listDiv.innerHTML = teachers.map(t => `
        <div class="data-card">
            <h4>${t.name}</h4>
            <p>${t.email} | ${t.level || 'Sin nivel'} | ${t.department || 'Sin depto'}</p>
            <button class="btn-outline disable-user" data-id="${t.id}">${t.active ? 'Desactivar' : 'Activar'}</button>
            <select class="assign-dept" data-id="${t.id}">${appData.institution.departments.map(d => `<option ${t.department===d ? 'selected' : ''}>${d}</option>`)}</select>
            <button class="btn-outline assign-dept-btn" data-id="${t.id}">Asignar</button>
        </div>
    `).join('');
    document.getElementById('addTeacherBtn').onclick = () => {
        const name = prompt("Nombre completo");
        const email = prompt("Correo");
        if (name && email) {
            const newTeacher = { id: generateId(), name, email, password: "temp123", role: "teacher", active: true, level: "Secundaria", department: null };
            appData.users.push(newTeacher);
            appData.auditLog.push({ date: new Date().toISOString(), userId: appData.currentUser.id, action: "Creación de usuario", detail: name });
            saveToLocalStorage();
            renderUserManagement();
            showToast("Docente creado", "success");
        }
    };
    document.getElementById('massiveUploadBtn').onclick = () => showToast("Carga masiva simulada (CSV)", "info");
    document.querySelectorAll('.disable-user').forEach(btn => {
        btn.onclick = () => {
            const user = appData.users.find(u => u.id === btn.dataset.id);
            user.active = !user.active;
            saveToLocalStorage();
            renderUserManagement();
        };
    });
    document.querySelectorAll('.assign-dept-btn').forEach(btn => {
        btn.onclick = () => {
            const uid = btn.dataset.id;
            const select = document.querySelector(`.assign-dept[data-id="${uid}"]`);
            const user = appData.users.find(u => u.id === uid);
            user.department = select.value;
            saveToLocalStorage();
            renderUserManagement();
        };
    });
}

function renderInstitutionSettings() {
    const container = document.getElementById('tabContent');
    container.innerHTML = `
        <div class="data-card">
            <h3>Editar Institución</h3>
            <input type="text" id="instName" value="${appData.institution.name}">
            <input type="text" id="instLogoUrl" value="${appData.institution.logo}">
            <button id="saveInstBtn" class="btn btn-primary">Guardar</button>
        </div>
        <div class="data-card">
            <h3>Departamentos</h3>
            <div id="deptList"></div>
            <input type="text" id="newDept"><button id="addDeptBtn">+</button>
        </div>
    `;
    document.getElementById('saveInstBtn').onclick = () => {
        appData.institution.name = document.getElementById('instName').value;
        appData.institution.logo = document.getElementById('instLogoUrl').value;
        saveToLocalStorage();
        renderInstitutionSettings();
        document.getElementById('institutionNameDisplay').innerText = appData.institution.name;
        document.getElementById('institutionLogo').src = appData.institution.logo;
        showToast("Institución actualizada", "success");
    };
    const deptDiv = document.getElementById('deptList');
    deptDiv.innerHTML = appData.institution.departments.map(d => `<span>${d} <button class="remove-dept" data-dept="${d}">❌</button></span>`).join('');
    document.getElementById('addDeptBtn').onclick = () => {
        const nd = document.getElementById('newDept').value.trim();
        if (nd && !appData.institution.departments.includes(nd)) {
            appData.institution.departments.push(nd);
            saveToLocalStorage();
            renderInstitutionSettings();
        }
    };
    document.querySelectorAll('.remove-dept').forEach(btn => {
        btn.onclick = () => {
            appData.institution.departments = appData.institution.departments.filter(d => d !== btn.dataset.dept);
            saveToLocalStorage();
            renderInstitutionSettings();
        };
    });
}

function renderAlertsConfig() {
    const director = appData.users.find(u => u.role === 'director');
    const threshold = director?.institutionConfig?.alertThreshold || 40;
    const container = document.getElementById('tabContent');
    container.innerHTML = `
        <div class="data-card">
            <h3>Umbral de alerta (%)</h3>
            <input type="number" id="thresholdInput" value="${threshold}" min="10" max="90">
            <button id="saveThresholdBtn" class="btn btn-primary">Guardar</button>
            <button id="testSOSBtn" class="btn-outline">Simular SOS</button>
        </div>
    `;
    document.getElementById('saveThresholdBtn').onclick = () => {
        const val = parseInt(document.getElementById('thresholdInput').value);
        if (val >= 10 && val <= 90) {
            director.institutionConfig.alertThreshold = val;
            saveToLocalStorage();
            showToast("Umbral actualizado", "success");
        }
    };
    document.getElementById('testSOSBtn').onclick = () => {
        console.log("SOS: Docente necesita ayuda psicológica");
        showToast("Alerta SOS enviada al directivo (simulado)", "info");
    };
}

// Helper para modal
function showModal(title, contentHtml) {
    const modal = document.getElementById('modal');
    if (!modal) return;
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `<h3>${title}</h3>${contentHtml}<button onclick="closeModal()">Cerrar</button>`;
    modal.style.display = 'flex';
    window.closeModal = () => modal.style.display = 'none';
}

// ==================== INICIALIZACIÓN Y EVENTOS GLOBALES ====================
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    checkSession();
    
    // Abrir modales de login/registro desde la landing
    const openLoginBtns = document.querySelectorAll('.open-login, #mobileOpenLogin, #desktopOpenLogin');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const forgotModal = document.getElementById('forgotModal');
    
    if (openLoginBtns.length) {
        openLoginBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (loginModal) loginModal.style.display = 'flex';
            });
        });
    }
    
    // Cerrar modales
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.onclick = () => {
            btn.closest('.modal').style.display = 'none';
        };
    });
    
    // Mostrar/ocultar campo institución según rol en registro
    const regRole = document.getElementById('regRole');
    const institutionField = document.getElementById('institutionField');
    if (regRole) {
        regRole.addEventListener('change', () => {
            if (institutionField) institutionField.style.display = regRole.value === 'director' ? 'block' : 'none';
        });
    }
    
    // Formulario de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const remember = document.getElementById('rememberMe').checked;
            if (login(email, password, remember)) {
                if (loginModal) loginModal.style.display = 'none';
            } else {
                showToast("Credenciales incorrectas", "error");
            }
        });
    }
    
    // Formulario de registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userData = {
                name: document.getElementById('regName').value,
                lastname: document.getElementById('regLastname').value,
                email: document.getElementById('regEmail').value,
                password: document.getElementById('regPassword').value,
                role: document.getElementById('regRole').value,
                institution: document.getElementById('regInstitution')?.value || ''
            };
            if (registerUser(userData)) {
                if (registerModal) registerModal.style.display = 'none';
            }
        });
    }
    
    // Cerrar sesión desde dashboard
    const logoutBtn = document.getElementById('logoutBtnDashboard');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    
    // Mostrar/ocultar contraseñas
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
    
    // Recuperar sesión recordada
    const remembered = localStorage.getItem('rememberedUser');
    if (remembered) {
        try {
            const { email, password } = JSON.parse(remembered);
            login(email, password, true);
        } catch(e) {}
    }
});