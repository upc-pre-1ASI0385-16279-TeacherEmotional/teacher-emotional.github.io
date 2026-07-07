// public/assets/scripts/director/director-users.js

function initDirectorUsers() {
    'use strict';

    // ===== VERIFICAR ELEMENTOS CLAVE =====
    const usersGrid = document.getElementById('usersGrid');
    if (!usersGrid) {
        console.warn('Elementos de director-users no encontrados');
        return;
    }

    // ===== VARIABLES =====
    let currentAction = null;
    let currentUserId = null;
    let currentUserData = null;

    // ===== CARGAR DATOS =====
    function loadUsers() {
        const stored = localStorage.getItem('teacherEmotionalData');
        const data = stored ? JSON.parse(stored) : { users: [], emotionalRecords: [], favoriteResources: {}, auditLog: [] };
        const teachers = data.users.filter(u => u.role === 'teacher') || [];

        // Filtros
        const searchTerm = document.getElementById('searchUser')?.value.toLowerCase().trim() || '';
        const statusFilter = document.querySelector('#statusFilters .filter-btn.active')?.dataset.status || 'all';

        let filtered = teachers.filter(t => {
            const matchesSearch = t.name.toLowerCase().includes(searchTerm) ||
                t.email.toLowerCase().includes(searchTerm);
            const matchesStatus = statusFilter === 'all' ||
                (statusFilter === 'active' && t.active) ||
                (statusFilter === 'inactive' && !t.active);
            return matchesSearch && matchesStatus;
        });

        // Actualizar estadísticas
        const totalUsersEl = document.getElementById('totalUsers');
        const activeUsersEl = document.getElementById('activeUsers');
        const inactiveUsersEl = document.getElementById('inactiveUsers');
        if (totalUsersEl) totalUsersEl.textContent = teachers.length;
        if (activeUsersEl) activeUsersEl.textContent = teachers.filter(t => t.active).length;
        if (inactiveUsersEl) inactiveUsersEl.textContent = teachers.filter(t => !t.active).length;

        const grid = document.getElementById('usersGrid');
        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="empty-state-card" style="grid-column:1/-1;">
                    <i class="ri-user-search-line"></i>
                    <h3>No se encontraron docentes</h3>
                    <p class="text-help">Prueba con otros filtros o crea un nuevo docente.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = filtered.map(t => `
            <div class="user-card" data-id="${t.id}">
                <div class="user-card-header">
                    <div class="user-avatar">${t.name.charAt(0).toUpperCase()}</div>
                    <div class="user-info">
                        <h4>${t.name}</h4>
                        <p class="text-help">${t.email}</p>
                    </div>
                    <span class="user-status ${t.active ? 'active' : 'inactive'}">
                        ${t.active ? '✅ Activo' : '❌ Inactivo'}
                    </span>
                </div>
                <div class="user-card-details">
                    <span><strong>Nivel:</strong> ${t.level || 'Sin asignar'}</span>
                    <span><strong>Departamento:</strong> ${t.department || 'Sin asignar'}</span>
                    <span><strong>Registros:</strong> ${data.emotionalRecords ? data.emotionalRecords.filter(r => r.userId === t.id).length : 0}</span>
                </div>
                <div class="user-card-actions">
                    <button class="btn-outline btn-sm edit-user" data-id="${t.id}">
                        <i class="ri-edit-line"></i> Editar
                    </button>
                    <button class="btn-outline btn-sm toggle-user" data-id="${t.id}">
                        ${t.active ? '<i class="ri-user-unfollow-line"></i> Desactivar' : '<i class="ri-user-follow-line"></i> Activar'}
                    </button>
                    <button class="btn-outline btn-sm reset-password" data-id="${t.id}">
                        <i class="ri-lock-reset-line"></i> Resetear
                    </button>
                </div>
            </div>
        `).join('');

        // ===== EVENT LISTENERS =====
        // Editar usuario
        document.querySelectorAll('.edit-user').forEach(btn => {
            // Remover listeners previos para evitar duplicados
            btn.removeEventListener('click', handleEditClick);
            btn.addEventListener('click', handleEditClick);
        });

        function handleEditClick() {
            const id = this.dataset.id;
            openEditModal(id);
        }

        // Toggle activar/desactivar
        document.querySelectorAll('.toggle-user').forEach(btn => {
            btn.removeEventListener('click', handleToggleClick);
            btn.addEventListener('click', handleToggleClick);
        });

        function handleToggleClick() {
            const id = this.dataset.id;
            const user = getTeacherById(id);
            if (user) {
                const action = user.active ? 'desactivar' : 'activar';
                openConfirmModal(
                    `${action === 'desactivar' ? '⚠️ Desactivar' : '✅ Activar'} docente`,
                    `¿Estás seguro de que deseas ${action} a <strong>${user.name}</strong>?`,
                    () => toggleUser(id)
                );
            }
        }

        // Resetear contraseña
        document.querySelectorAll('.reset-password').forEach(btn => {
            btn.removeEventListener('click', handleResetClick);
            btn.addEventListener('click', handleResetClick);
        });

        function handleResetClick() {
            const id = this.dataset.id;
            const user = getTeacherById(id);
            if (user) {
                openConfirmModal(
                    '🔑 Resetear contraseña',
                    `Se enviará una nueva contraseña temporal a <strong>${user.name}</strong>. ¿Continuar?`,
                    () => resetPassword(id)
                );
            }
        }
    }

    // ===== HELPERS =====
    function getTeacherById(id) {
        const stored = localStorage.getItem('teacherEmotionalData');
        const data = stored ? JSON.parse(stored) : { users: [] };
        return data.users.find(u => u.id === id);
    }

    function updateUserField(id, field, value) {
        const stored = localStorage.getItem('teacherEmotionalData');
        const data = stored ? JSON.parse(stored) : { users: [] };
        const user = data.users.find(u => u.id === id);
        if (user) {
            user[field] = value;
            localStorage.setItem('teacherEmotionalData', JSON.stringify(data));
            return true;
        }
        return false;
    }

    function addAuditLog(action, detail) {
        const stored = localStorage.getItem('teacherEmotionalData');
        const data = stored ? JSON.parse(stored) : { users: [], emotionalRecords: [], favoriteResources: {}, auditLog: [] };
        if (!data.auditLog) data.auditLog = [];
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
        data.auditLog.push({
            date: new Date().toISOString(),
            userId: currentUser.id || 'unknown',
            action: action,
            detail: detail
        });
        localStorage.setItem('teacherEmotionalData', JSON.stringify(data));
    }

    // ===== MODAL: CREAR USUARIO =====
    function openCreateModal() {
        const modal = document.getElementById('createUserModal');
        if (modal) {
            modal.style.display = 'flex';
            document.getElementById('createUserForm').reset();
        }
    }

    function closeCreateModal() {
        const modal = document.getElementById('createUserModal');
        if (modal) modal.style.display = 'none';
    }

    function handleCreateUser(e) {
        e.preventDefault();
        const name = document.getElementById('newUserName').value.trim();
        const email = document.getElementById('newUserEmail').value.trim();
        const level = document.getElementById('newUserLevel').value;
        const department = document.getElementById('newUserDept').value;

        if (!name || !email) {
            showToast('Por favor completa los campos obligatorios', 'error');
            return;
        }

        const stored = localStorage.getItem('teacherEmotionalData');
        const data = stored ? JSON.parse(stored) : { users: [], emotionalRecords: [], favoriteResources: {}, auditLog: [] };

        // Verificar duplicado
        if (data.users.some(u => u.email === email)) {
            showToast('Ya existe un usuario con ese correo', 'error');
            return;
        }

        const newUser = {
            id: Date.now() + '-' + Math.random().toString(36).substr(2, 6),
            name: name,
            email: email,
            password: 'temp123',
            role: 'teacher',
            active: true,
            verified: false,
            level: level || 'Secundaria',
            department: department || null
        };

        data.users.push(newUser);
        localStorage.setItem('teacherEmotionalData', JSON.stringify(data));
        addAuditLog('Creación de usuario', `Docente: ${name} (${email})`);
        closeCreateModal();
        showToast('✅ Docente creado correctamente', 'success');
        loadUsers();
    }

    // ===== MODAL: EDITAR USUARIO =====
    function openEditModal(id) {
        const user = getTeacherById(id);
        if (!user) return;

        currentUserId = id;
        document.getElementById('editUserId').value = id;
        document.getElementById('editUserName').value = user.name;
        document.getElementById('editUserEmail').value = user.email;
        document.getElementById('editUserLevel').value = user.level || 'Secundaria';
        document.getElementById('editUserDept').value = user.department || '';

        const modal = document.getElementById('editUserModal');
        if (modal) modal.style.display = 'flex';
    }

    function closeEditModal() {
        const modal = document.getElementById('editUserModal');
        if (modal) modal.style.display = 'none';
        currentUserId = null;
    }

    function handleEditUser(e) {
        e.preventDefault();
        const id = document.getElementById('editUserId').value;
        const name = document.getElementById('editUserName').value.trim();
        const email = document.getElementById('editUserEmail').value.trim();
        const level = document.getElementById('editUserLevel').value;
        const department = document.getElementById('editUserDept').value;

        if (!name || !email) {
            showToast('Nombre y correo son obligatorios', 'error');
            return;
        }

        const stored = localStorage.getItem('teacherEmotionalData');
        const data = stored ? JSON.parse(stored) : { users: [] };
        const user = data.users.find(u => u.id === id);
        if (user) {
            const oldName = user.name;
            user.name = name;
            user.email = email;
            user.level = level;
            user.department = department || null;
            localStorage.setItem('teacherEmotionalData', JSON.stringify(data));
            addAuditLog('Edición de usuario', `Docente: ${oldName} → ${name}`);
            closeEditModal();
            showToast('✅ Cambios guardados correctamente', 'success');
            loadUsers();
        }
    }

    // ===== MODAL: CONFIRMAR =====
    function openConfirmModal(title, message, onConfirm) {
        document.getElementById('confirmTitle').textContent = title;
        document.getElementById('confirmMessage').innerHTML = message;
        const modal = document.getElementById('confirmModal');
        if (modal) modal.style.display = 'flex';
        currentAction = onConfirm;
    }

    function closeConfirmModal() {
        const modal = document.getElementById('confirmModal');
        if (modal) modal.style.display = 'none';
        currentAction = null;
    }

    function executeConfirm() {
        if (typeof currentAction === 'function') {
            currentAction();
        }
        closeConfirmModal();
    }

    // ===== ACCIONES =====
    function toggleUser(id) {
        const user = getTeacherById(id);
        if (user) {
            const newStatus = !user.active;
            user.active = newStatus;
            const stored = localStorage.getItem('teacherEmotionalData');
            const data = stored ? JSON.parse(stored) : { users: [] };
            const idx = data.users.findIndex(u => u.id === id);
            if (idx !== -1) {
                data.users[idx] = user;
                localStorage.setItem('teacherEmotionalData', JSON.stringify(data));
                addAuditLog(
                    newStatus ? 'Activación de usuario' : 'Desactivación de usuario',
                    `Docente: ${user.name} (${user.email})`
                );
                showToast(`✅ Usuario ${newStatus ? 'activado' : 'desactivado'} correctamente`, 'success');
                loadUsers();
            }
        }
    }

    function resetPassword(id) {
        const user = getTeacherById(id);
        if (user) {
            const newPassword = 'temp' + Math.random().toString(36).substr(2, 4);
            user.password = newPassword;
            const stored = localStorage.getItem('teacherEmotionalData');
            const data = stored ? JSON.parse(stored) : { users: [] };
            const idx = data.users.findIndex(u => u.id === id);
            if (idx !== -1) {
                data.users[idx] = user;
                localStorage.setItem('teacherEmotionalData', JSON.stringify(data));
                addAuditLog('Reseteo de contraseña', `Docente: ${user.name} (${user.email})`);
                showToast(`🔑 Nueva contraseña temporal: ${newPassword} (simulado)`, 'info');
                loadUsers();
            }
        }
    }

    // ===== FILTROS Y BÚSQUEDA =====
    function setupFilters() {
        // Filtros de estado
        document.querySelectorAll('#statusFilters .filter-btn').forEach(btn => {
            btn.removeEventListener('click', handleStatusFilterClick);
            btn.addEventListener('click', handleStatusFilterClick);
        });

        function handleStatusFilterClick() {
            document.querySelectorAll('#statusFilters .filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            loadUsers();
        }

        // Búsqueda
        const searchInput = document.getElementById('searchUser');
        if (searchInput) {
            searchInput.removeEventListener('input', loadUsers);
            searchInput.addEventListener('input', loadUsers);
        }
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

    // ===== EVENTOS DE MODALES =====
    const addUserBtn = document.getElementById('addUserBtn');
    if (addUserBtn) {
        addUserBtn.removeEventListener('click', openCreateModal);
        addUserBtn.addEventListener('click', openCreateModal);
    }

    const closeCreateBtn = document.getElementById('closeCreateUserModal');
    if (closeCreateBtn) {
        closeCreateBtn.removeEventListener('click', closeCreateModal);
        closeCreateBtn.addEventListener('click', closeCreateModal);
    }

    const cancelCreateBtn = document.getElementById('cancelCreateUser');
    if (cancelCreateBtn) {
        cancelCreateBtn.removeEventListener('click', closeCreateModal);
        cancelCreateBtn.addEventListener('click', closeCreateModal);
    }

    const createForm = document.getElementById('createUserForm');
    if (createForm) {
        createForm.removeEventListener('submit', handleCreateUser);
        createForm.addEventListener('submit', handleCreateUser);
    }

    const closeEditBtn = document.getElementById('closeEditUserModal');
    if (closeEditBtn) {
        closeEditBtn.removeEventListener('click', closeEditModal);
        closeEditBtn.addEventListener('click', closeEditModal);
    }

    const cancelEditBtn = document.getElementById('cancelEditUser');
    if (cancelEditBtn) {
        cancelEditBtn.removeEventListener('click', closeEditModal);
        cancelEditBtn.addEventListener('click', closeEditModal);
    }

    const editForm = document.getElementById('editUserForm');
    if (editForm) {
        editForm.removeEventListener('submit', handleEditUser);
        editForm.addEventListener('submit', handleEditUser);
    }

    const closeConfirmBtn = document.getElementById('closeConfirmModal');
    if (closeConfirmBtn) {
        closeConfirmBtn.removeEventListener('click', closeConfirmModal);
        closeConfirmBtn.addEventListener('click', closeConfirmModal);
    }

    const cancelConfirmBtn = document.getElementById('cancelConfirm');
    if (cancelConfirmBtn) {
        cancelConfirmBtn.removeEventListener('click', closeConfirmModal);
        cancelConfirmBtn.addEventListener('click', closeConfirmModal);
    }

    const confirmActionBtn = document.getElementById('confirmActionBtn');
    if (confirmActionBtn) {
        confirmActionBtn.removeEventListener('click', executeConfirm);
        confirmActionBtn.addEventListener('click', executeConfirm);
    }

    // Cerrar modales al hacer clic fuera
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.removeEventListener('click', handleModalOutsideClick);
        modal.addEventListener('click', handleModalOutsideClick);
    });

    function handleModalOutsideClick(e) {
        if (e.target === this) {
            this.style.display = 'none';
            currentAction = null;
        }
    }

    // ===== INICIALIZAR =====
    function init() {
        loadUsers();
        setupFilters();
    }

    // Ejecutar cuando la vista se carga
    init();
}

// ===== EJECUCIÓN CON viewLoaded =====
document.addEventListener('viewLoaded', function(e) {
    if (e.detail.viewId === 'director-users') {
        initDirectorUsers();
    }
});

// También ejecutar si la vista ya está cargada (por si se recarga la página en esta vista)
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    if (document.getElementById('usersGrid')) {
        initDirectorUsers();
    }
}