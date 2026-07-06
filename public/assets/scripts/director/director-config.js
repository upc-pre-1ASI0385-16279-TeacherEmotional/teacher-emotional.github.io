(function() {
    // Verificar que los elementos principales existen
    const requiredElements = ['usersGrid', 'totalUsers', 'activeUsers', 'inactiveUsers'];
    const missing = requiredElements.filter(id => !document.getElementById(id));
    if (missing.length > 0) {
        console.warn('Elementos de director-users no encontrados:', missing);
        return;
    }

    'use strict';

    // ===== REFERENCIAS DOM =====
    const instNameInput = document.getElementById('instName');
    const instLogoInput = document.getElementById('instLogo');
    const logoImage = document.getElementById('logoImage');
    const logoPlaceholder = document.getElementById('logoPlaceholder');
    const logoFileInput = document.getElementById('logoFileInput');
    const uploadLogoBtn = document.getElementById('uploadLogoBtn');
    const resetLogoBtn = document.getElementById('resetLogoBtn');
    const institutionForm = document.getElementById('institutionForm');
    const deptList = document.getElementById('deptList');
    const newDeptInput = document.getElementById('newDeptInput');
    const addDeptBtn = document.getElementById('addDeptBtn');
    const levelsList = document.getElementById('levelsList');
    const newLevelInput = document.getElementById('newLevelInput');
    const addLevelBtn = document.getElementById('addLevelBtn');
    const auditContainer = document.getElementById('auditContainer');

    // ===== CARGAR DATOS =====
    function loadInstitutionData() {
        const stored = localStorage.getItem('teacherEmotionalData');
        const data = stored ? JSON.parse(stored) : {};
        const institution = data.institution || {
            name: 'Colegio Los Álamos',
            logo: 'https://i.imgur.com/32rW4mJ.png',
            levels: ['Inicial', 'Primaria', 'Secundaria'],
            departments: ['Matemáticas', 'Comunicación', 'Ciencias', 'Historia']
        };

        // Nombre
        instNameInput.value = institution.name || '';

        // Logo
        const logoUrl = institution.logo || 'https://i.imgur.com/32rW4mJ.png';
        instLogoInput.value = logoUrl;
        updateLogoPreview(logoUrl);

        // Niveles
        const levels = institution.levels || ['Inicial', 'Primaria', 'Secundaria'];
        renderTags(levelsList, levels, 'level');

        // Departamentos
        const depts = institution.departments || ['Matemáticas', 'Comunicación', 'Ciencias', 'Historia'];
        renderTags(deptList, depts, 'dept');

        // Auditoría
        renderAudit(data.auditLog || []);
    }

    // ===== PREVISUALIZACIÓN DE LOGO =====
    function updateLogoPreview(url) {
        if (url && url.trim() !== '') {
            logoImage.src = url;
            logoImage.style.display = 'block';
            logoPlaceholder.style.display = 'none';
        } else {
            logoImage.style.display = 'none';
            logoPlaceholder.style.display = 'flex';
        }
    }

    // ===== RENDER TAGS (niveles y departamentos) =====
    function renderTags(container, items, type) {
        if (!items || items.length === 0) {
            container.innerHTML = `<p class="text-help">No hay ${type === 'dept' ? 'departamentos' : 'niveles'} configurados.</p>`;
            return;
        }
        container.innerHTML = items.map(item => `
                <span class="tag-chip">
                    ${item}
                    <button class="tag-remove" data-type="${type}" data-value="${item}">✕</button>
                </span>
            `).join('');

        // Event listeners para eliminar
        container.querySelectorAll('.tag-remove').forEach(btn => {
            btn.addEventListener('click', function() {
                const type = this.dataset.type;
                const value = this.dataset.value;
                removeTag(type, value);
            });
        });
    }

    // ===== AGREGAR TAG =====
    function addTag(type, value) {
        if (!value || value.trim() === '') return false;
        value = value.trim();

        const stored = localStorage.getItem('teacherEmotionalData');
        const data = stored ? JSON.parse(stored) : { institution: {} };
        if (!data.institution) data.institution = {};

        const key = type === 'dept' ? 'departments' : 'levels';
        if (!data.institution[key]) data.institution[key] = [];

        if (data.institution[key].includes(value)) {
            showToast(`El ${type === 'dept' ? 'departamento' : 'nivel'} ya existe`, 'error');
            return false;
        }

        data.institution[key].push(value);
        localStorage.setItem('teacherEmotionalData', JSON.stringify(data));
        loadInstitutionData();
        showToast(`${type === 'dept' ? 'Departamento' : 'Nivel'} agregado correctamente`, 'success');
        return true;
    }

    // ===== ELIMINAR TAG =====
    function removeTag(type, value) {
        const stored = localStorage.getItem('teacherEmotionalData');
        const data = stored ? JSON.parse(stored) : { institution: {} };
        if (!data.institution) return;

        const key = type === 'dept' ? 'departments' : 'levels';
        if (!data.institution[key]) return;

        data.institution[key] = data.institution[key].filter(item => item !== value);
        localStorage.setItem('teacherEmotionalData', JSON.stringify(data));
        loadInstitutionData();
        showToast(`${type === 'dept' ? 'Departamento' : 'Nivel'} eliminado`, 'info');
    }

    // ===== AUDITORÍA =====
    function renderAudit(logs) {
        if (!logs || logs.length === 0) {
            auditContainer.innerHTML = `
                    <div class="empty-audit">
                        <i class="ri-file-list-line"></i>
                        <p>No hay registros de auditoría aún.</p>
                        <p class="text-help">Las acciones de los usuarios se registrarán aquí.</p>
                    </div>
                `;
            return;
        }

        // Mostrar últimos 10 registros (más reciente primero)
        const sorted = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

        let html = `
                <div class="audit-table-wrapper">
                    <table class="audit-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Usuario</th>
                                <th>Acción</th>
                                <th>Detalle</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

        sorted.forEach(log => {
            const date = new Date(log.date);
            const dateStr = date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
            const timeStr = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
            html += `
                    <tr>
                        <td><span class="audit-date">${dateStr}</span><span class="audit-time">${timeStr}</span></td>
                        <td>${log.userId || 'Sistema'}</td>
                        <td><span class="audit-action">${log.action || 'Acción'}</span></td>
                        <td>${log.detail || ''}</td>
                    </tr>
                `;
        });

        html += `
                        </tbody>
                    </table>
                </div>
                ${logs.length > 10 ? `<p class="text-help">Mostrando los 10 registros más recientes de ${logs.length} totales.</p>` : ''}
            `;

        auditContainer.innerHTML = html;
    }

    // ===== GUARDAR PERFIL =====
    function saveInstitutionProfile(e) {
        e.preventDefault();

        const name = instNameInput.value.trim();
        const logo = instLogoInput.value.trim();

        if (!name) {
            showToast('El nombre de la institución es obligatorio', 'error');
            return;
        }

        const stored = localStorage.getItem('teacherEmotionalData');
        const data = stored ? JSON.parse(stored) : { institution: {} };
        if (!data.institution) data.institution = {};

        data.institution.name = name;
        data.institution.logo = logo;

        localStorage.setItem('teacherEmotionalData', JSON.stringify(data));

        // Actualizar el header del dashboard en tiempo real (solo si estamos en el contexto del dashboard)
        const nameDisplay = document.getElementById('institutionNameDisplay');
        if (nameDisplay) nameDisplay.textContent = name;
        const logoImg = document.getElementById('institutionLogo');
        if (logoImg) logoImg.src = logo;

        showToast('✅ Configuración guardada correctamente', 'success');
    }

    // ===== MANEJAR CARGA DE LOGO =====
    function handleLogoUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Validar tipo y tamaño (simulado)
        if (!file.type.startsWith('image/')) {
            showToast('Por favor selecciona una imagen', 'error');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            showToast('La imagen no debe superar los 2MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            const dataUrl = event.target.result;
            instLogoInput.value = dataUrl;
            updateLogoPreview(dataUrl);
            showToast('Logo cargado correctamente. Guarda los cambios para persistir.', 'info');
        };
        reader.readAsDataURL(file);
        // Resetear input para permitir cargar el mismo archivo nuevamente
        logoFileInput.value = '';
    }

    function resetLogo() {
        const defaultLogo = 'https://i.imgur.com/32rW4mJ.png';
        instLogoInput.value = defaultLogo;
        updateLogoPreview(defaultLogo);
        showToast('Logo restaurado al predeterminado', 'info');
    }

    // ===== TOAST =====
    function showToast(message, type) {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<span>${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // ===== EVENTOS =====
    // Perfil
    institutionForm.addEventListener('submit', saveInstitutionProfile);

    // Logo
    uploadLogoBtn.addEventListener('click', () => logoFileInput.click());
    logoFileInput.addEventListener('change', handleLogoUpload);
    resetLogoBtn.addEventListener('click', resetLogo);

    // Departamentos
    addDeptBtn.addEventListener('click', () => {
        const value = newDeptInput.value.trim();
        if (addTag('dept', value)) {
            newDeptInput.value = '';
        }
    });
    newDeptInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addDeptBtn.click();
        }
    });

    // Niveles
    addLevelBtn.addEventListener('click', () => {
        const value = newLevelInput.value.trim();
        if (addTag('level', value)) {
            newLevelInput.value = '';
        }
    });
    newLevelInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addLevelBtn.click();
        }
    });

    // ===== INICIALIZAR =====
    loadInstitutionData();

    // Recargar cuando la vista se active (por si hay cambios desde otra pestaña)
    document.addEventListener('viewLoaded', function(e) {
        if (e.detail.viewId === 'director-config') {
            loadInstitutionData();
        }
    });

    // También recargar al hacer clic en el enlace del menú (por si acaso)
    // Esto ya lo maneja el sistema de navegación.

})();