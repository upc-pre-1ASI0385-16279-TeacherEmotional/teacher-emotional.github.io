// public/assets/scripts/shared/library.js

function initLibrary() {
    'use strict';

    // ===== DATOS DE RECURSOS =====
    const defaultResources = [
        { id: 'r1', type: 'audio', title: 'Respiración consciente', description: 'Meditación guiada de 5 min para reducir la ansiedad y conectar con tu respiración.', icon: '🎵', tags: ['ansiedad', 'relajación', 'mindfulness'] },
        { id: 'r2', type: 'video', title: 'Estiramiento de cuello y hombros', description: 'Pausa activa de 3 min para aliviar la tensión acumulada en la zona cervical.', icon: '🎬', tags: ['pausa', 'estiramiento', 'cuello'] },
        { id: 'r3', type: 'article', title: 'Manejo del estrés en el aula', description: 'Consejos prácticos para docentes que enfrentan situaciones de alta presión en el salón de clases.', icon: '📄', tags: ['estrés', 'aula', 'práctico'] },
        { id: 'r4', type: 'audio', title: 'Mindfulness para docentes', description: 'Reduce la ansiedad antes de clases con esta práctica de atención plena de 10 min.', icon: '🎵', tags: ['mindfulness', 'ansiedad'] },
        { id: 'r5', type: 'video', title: 'Pausa activa de piernas y espalda', description: 'Movilidad y energía para seguir con tus clases sin molestias físicas.', icon: '🎬', tags: ['pausa', 'movilidad', 'espalda'] },
        { id: 'r6', type: 'article', title: 'Prevención del burnout docente', description: 'Señales de alerta tempranas y estrategias de autocuidado para evitar el agotamiento.', icon: '📄', tags: ['burnout', 'autocuidado', 'prevención'] },
        { id: 'r7', type: 'audio', title: 'Relajación progresiva para dormir', description: 'Técnica de relajación muscular guiada para conciliar el sueño después de un día agotador.', icon: '🎵', tags: ['sueño', 'relajación'] },
        { id: 'r8', type: 'video', title: 'Ejercicios de respiración para el aula', description: 'Rutina de 2 min para hacer con tus estudiantes y bajar la ansiedad colectiva.', icon: '🎬', tags: ['respiración', 'aula'] }
    ];

    // ===== ESTADO =====
    let resources = [...defaultResources];
    let currentUser = null;
    let favorites = [];
    let ratings = {};

    // ===== CARGAR USUARIO =====
    try {
        const userJson = sessionStorage.getItem('currentUser');
        if (userJson) {
            currentUser = JSON.parse(userJson);
        }
    } catch(e) {}

    // ===== CARGAR DATOS DESDE LOCALSTORAGE =====
    function loadUserData() {
        if (!currentUser) return;
        const stored = localStorage.getItem('teacherEmotionalData');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                if (data.favoriteResources && data.favoriteResources[currentUser.id]) {
                    favorites = data.favoriteResources[currentUser.id] || [];
                }
                if (data.resourceRatings && data.resourceRatings[currentUser.id]) {
                    ratings = data.resourceRatings[currentUser.id] || {};
                }
            } catch(e) {}
        }
    }

    function saveUserData() {
        if (!currentUser) return;
        const stored = localStorage.getItem('teacherEmotionalData');
        let data = stored ? JSON.parse(stored) : {};
        if (!data.favoriteResources) data.favoriteResources = {};
        data.favoriteResources[currentUser.id] = favorites;
        if (!data.resourceRatings) data.resourceRatings = {};
        data.resourceRatings[currentUser.id] = ratings;
        localStorage.setItem('teacherEmotionalData', JSON.stringify(data));
    }

    // ===== RENDERIZAR RECURSOS =====
    function renderResources() {
        const searchInput = document.getElementById('searchResource');
        if (!searchInput) return;
        const searchTerm = searchInput.value.toLowerCase().trim();
        const activeType = document.querySelector('#typeFilters .filter-btn.active')?.dataset.type || 'all';

        let filtered = resources.filter(r => {
            const matchesSearch = r.title.toLowerCase().includes(searchTerm) ||
                r.description.toLowerCase().includes(searchTerm) ||
                r.tags.some(t => t.toLowerCase().includes(searchTerm));
            const matchesType = activeType === 'all' || r.type === activeType;
            return matchesSearch && matchesType;
        });

        // Actualizar contador
        const counter = document.getElementById('resourcesCounter');
        if (counter) counter.textContent = `${filtered.length} recursos`;

        const grid = document.getElementById('resourcesGrid');
        if (!grid) return;

        if (filtered.length === 0) {
            grid.innerHTML = `
                    <div class="empty-state-card" style="grid-column:1/-1;">
                        <i class="ri-search-line"></i>
                        <h3>No se encontraron recursos</h3>
                        <p class="text-help">Prueba con otra palabra clave o filtro.</p>
                    </div>
                `;
            return;
        }

        grid.innerHTML = filtered.map(r => {
            const isFavorite = favorites.includes(r.id);
            const userRating = ratings[r.id] || 0;
            const stars = getStarsHtml(userRating);
            return `
                    <div class="resource-card" data-id="${r.id}">
                        <div class="resource-header">
                            <span class="resource-type-badge ${r.type}">${r.icon}</span>
                            <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-id="${r.id}">
                                ${isFavorite ? '❤️' : '🤍'}
                            </button>
                        </div>
                        <h4>${r.title}</h4>
                        <p>${r.description}</p>
                        <div class="resource-tags">
                            ${r.tags.map(tag => `<span class="tag-sm">#${tag}</span>`).join('')}
                        </div>
                        <div class="resource-footer">
                            <div class="resource-rating">
                                ${stars} <span class="rating-count">(${userRating > 0 ? userRating : 'Sin calificar'})</span>
                            </div>
                            <button class="btn btn-secondary btn-sm view-resource-btn" data-id="${r.id}">Ver recurso</button>
                        </div>
                    </div>
                `;
        }).join('');

        // ===== EVENT LISTENERS =====
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const id = this.dataset.id;
                toggleFavorite(id);
            });
        });

        document.querySelectorAll('.view-resource-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.dataset.id;
                openResourceModal(id);
            });
        });

        renderFavorites();
    }

    // ===== RENDERIZAR FAVORITOS =====
    function renderFavorites() {
        const section = document.getElementById('favoritesSection');
        const grid = document.getElementById('favoritesGrid');
        if (!section || !grid) return;

        if (favorites.length === 0) {
            section.style.display = 'none';
            return;
        }

        section.style.display = 'block';
        const favResources = resources.filter(r => favorites.includes(r.id));

        if (favResources.length === 0) {
            grid.innerHTML = `<p class="text-help">Tus favoritos aparecerán aquí.</p>`;
            return;
        }

        grid.innerHTML = favResources.map(r => `
                <div class="resource-card mini">
                    <div class="resource-header">
                        <span class="resource-type-badge ${r.type}">${r.icon}</span>
                    </div>
                    <h4>${r.title}</h4>
                    <button class="btn btn-secondary btn-sm view-resource-btn" data-id="${r.id}">Ver</button>
                </div>
            `).join('');

        grid.querySelectorAll('.view-resource-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.dataset.id;
                openResourceModal(id);
            });
        });
    }

    // ===== FAVORITOS =====
    function toggleFavorite(id) {
        const index = favorites.indexOf(id);
        if (index > -1) {
            favorites.splice(index, 1);
            showToast('Recurso eliminado de favoritos', 'info');
        } else {
            favorites.push(id);
            showToast('¡Recurso agregado a favoritos! ❤️', 'success');
        }
        saveUserData();
        renderResources();
    }

    // ===== ESTRELLAS HTML =====
    function getStarsHtml(rating) {
        const full = Math.floor(rating);
        const empty = 5 - full;
        return '⭐'.repeat(full) + '☆'.repeat(empty);
    }

    // ===== MODAL DE DETALLE =====
    let currentModalResourceId = null;

    function openResourceModal(id) {
        const resource = resources.find(r => r.id === id);
        if (!resource) return;

        currentModalResourceId = id;
        const modal = document.getElementById('resourceModal');
        if (!modal) return;
        const titleEl = document.getElementById('modalTitle');
        const iconEl = document.getElementById('modalIcon');
        const descEl = document.getElementById('modalDescription');
        const tagsContainer = document.getElementById('modalTags');
        const favBtn = document.getElementById('modalFavoriteBtn');
        const starsDisplay = document.getElementById('modalStarsDisplay');
        const ratingCount = document.getElementById('modalRatingCount');

        if (titleEl) titleEl.textContent = resource.title;
        if (iconEl) iconEl.textContent = resource.icon;
        if (descEl) descEl.textContent = resource.description;
        if (tagsContainer) tagsContainer.innerHTML = resource.tags.map(t => `<span class="tag-sm">#${t}</span>`).join('');

        const isFavorite = favorites.includes(id);
        if (favBtn) {
            favBtn.textContent = isFavorite ? '❤️ Quitar de favoritos' : '🤍 Agregar a favoritos';
            favBtn.dataset.id = id;
        }

        const userRating = ratings[id] || 0;
        if (starsDisplay) starsDisplay.textContent = getStarsHtml(userRating);
        if (ratingCount) ratingCount.textContent = `(${userRating > 0 ? userRating : 'Sin calificar'})`;

        modal.style.display = 'flex';
    }

    function closeModal() {
        const modal = document.getElementById('resourceModal');
        if (modal) modal.style.display = 'none';
    }

    // ===== CALIFICAR =====
    function rateResource(id, stars) {
        ratings[id] = stars;
        saveUserData();
        if (currentModalResourceId === id) {
            const starsDisplay = document.getElementById('modalStarsDisplay');
            const ratingCount = document.getElementById('modalRatingCount');
            if (starsDisplay) starsDisplay.textContent = getStarsHtml(stars);
            if (ratingCount) ratingCount.textContent = `(${stars})`;
        }
        renderResources();
        showToast(`Calificación: ${stars} estrellas ⭐`, 'success');
    }

    // ===== EVENTOS DEL MODAL =====
    const closeBtn = document.getElementById('closeModalBtn');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    const modalOverlay = document.getElementById('resourceModal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === this) closeModal();
        });
    }

    const favModalBtn = document.getElementById('modalFavoriteBtn');
    if (favModalBtn) {
        favModalBtn.addEventListener('click', function() {
            const id = this.dataset.id;
            toggleFavorite(id);
            const isFavorite = favorites.includes(id);
            this.textContent = isFavorite ? '❤️ Quitar de favoritos' : '🤍 Agregar a favoritos';
            renderResources();
        });
    }

    const rateBtn = document.getElementById('modalRateBtn');
    if (rateBtn) {
        rateBtn.addEventListener('click', function() {
            if (!currentModalResourceId) return;
            const stars = prompt('Califica este recurso (1-5 estrellas):', '5');
            if (stars !== null) {
                const num = parseInt(stars);
                if (num >= 1 && num <= 5) {
                    rateResource(currentModalResourceId, num);
                } else {
                    showToast('Por favor ingresa un número entre 1 y 5', 'error');
                }
            }
        });
    }

    // ===== FILTROS Y BÚSQUEDA =====
    document.querySelectorAll('#typeFilters .filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('#typeFilters .filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderResources();
        });
    });

    const searchInput = document.getElementById('searchResource');
    if (searchInput) searchInput.addEventListener('input', renderResources);

    // ===== TOAST HELPER =====
    function showToast(message, type) {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<span>${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // ===== INICIALIZAR =====
    loadUserData();
    renderResources();
}

// ===== EJECUCIÓN CON viewLoaded =====
document.addEventListener('viewLoaded', function(e) {
    if (e.detail.viewId === 'library') {
        initLibrary();
    }
});

// También ejecutar inmediatamente si la vista ya está presente
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    // Verificar si la vista actual es library (buscando un elemento único)
    if (document.getElementById('resourcesGrid')) {
        initLibrary();
    }
}