// public/assets/scripts/shared/community.js

function initCommunity() {
    'use strict';

    // ===== ELEMENTOS DOM =====
    const postsContainer = document.getElementById('postsContainer');
    const createPostBtn = document.getElementById('createPostBtn');
    const filterButtons = document.querySelectorAll('#communityFilters .filter-btn');
    const postsCounter = document.getElementById('postsCounter');
    const totalPostsStat = document.getElementById('totalPostsStat');
    const popularPostStat = document.getElementById('popularPostStat');

    // Si no existe el contenedor principal, la vista no está cargada
    if (!postsContainer) {
        console.warn('Elementos de community no encontrados');
        return;
    }

    // ===== ESTADO =====
    let posts = [];
    let currentUser = null;
    let currentPostIdForComments = null;

    // ===== CARGAR USUARIO =====
    try {
        const userJson = sessionStorage.getItem('currentUser');
        if (userJson) {
            currentUser = JSON.parse(userJson);
        }
    } catch(e) {}

    // ===== DATOS DE EJEMPLO (solo si no hay guardados) =====
    const defaultPosts = [
        {
            id: 'p1',
            author: 'María Gómez',
            authorAvatar: '👩‍🏫',
            category: 'logro',
            content: '¡Hoy logré implementar una pausa activa de 5 minutos con mis estudiantes! La energía en el aula mejoró notablemente. 🧘‍♀️',
            date: new Date(Date.now() - 3600000 * 2).toISOString(),
            likes: 12,
            likedBy: [],
            comments: [
                { id: 'c1', author: 'Carlos Ruiz', content: '¡Qué buena idea! Voy a intentarlo también.', date: new Date(Date.now() - 3600000).toISOString() },
                { id: 'c2', author: 'Ana Torres', content: 'Me encanta, los niños necesitan esos momentos.', date: new Date(Date.now() - 1800000).toISOString() }
            ]
        },
        {
            id: 'p2',
            author: 'Carlos Ruiz',
            authorAvatar: '👨‍🏫',
            category: 'tip',
            content: '💡 Consejo: Si sientes que el estrés te supera, tómate 2 minutos para respirar profundamente antes de entrar al aula. Marca la diferencia.',
            date: new Date(Date.now() - 3600000 * 5).toISOString(),
            likes: 8,
            likedBy: [],
            comments: [
                { id: 'c3', author: 'María Gómez', content: '¡Justo lo que necesitaba leer hoy!', date: new Date(Date.now() - 2400000).toISOString() }
            ]
        },
        {
            id: 'p3',
            author: 'Ana Torres',
            authorAvatar: '👩‍🏫',
            category: 'pregunta',
            content: '❓ ¿Alguien ha probado técnicas de mindfulness en el aula? Me gustaría saber cómo les ha ido y qué recursos recomiendan.',
            date: new Date(Date.now() - 3600000 * 24).toISOString(),
            likes: 5,
            likedBy: [],
            comments: []
        },
        {
            id: 'p4',
            author: 'Luis Mendoza',
            authorAvatar: '👨‍🏫',
            category: 'reflexion',
            content: '🧠 Reflexión de la semana: "La paciencia no es la capacidad de esperar, sino la capacidad de mantener una buena actitud mientras esperas." Aplicado a la docencia, es un recordatorio diario.',
            date: new Date(Date.now() - 3600000 * 48).toISOString(),
            likes: 15,
            likedBy: [],
            comments: [
                { id: 'c4', author: 'Carlos Ruiz', content: 'Muy cierto, la paciencia es clave en nuestra profesión.', date: new Date(Date.now() - 3600000 * 24).toISOString() },
                { id: 'c5', author: 'María Gómez', content: 'Me llevo esta reflexión. Gracias por compartir.', date: new Date(Date.now() - 3600000 * 20).toISOString() }
            ]
        }
    ];

    // ===== CARGAR POSTS =====
    function loadPosts() {
        const stored = localStorage.getItem('teacherEmotionalData');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                if (data.communityPosts && data.communityPosts.length > 0) {
                    posts = data.communityPosts;
                    return;
                }
            } catch(e) {}
        }
        // Si no hay datos guardados, usar los de ejemplo
        posts = JSON.parse(JSON.stringify(defaultPosts));
        posts.forEach(p => {
            if (!p.likedBy) p.likedBy = [];
        });
        savePosts();
    }

    function savePosts() {
        const stored = localStorage.getItem('teacherEmotionalData');
        let data = stored ? JSON.parse(stored) : {};
        data.communityPosts = posts;
        localStorage.setItem('teacherEmotionalData', JSON.stringify(data));
    }

    // ===== HELPERS =====
    function getCategoryLabel(category) {
        const map = {
            'logro': '🏆 Logro',
            'tip': '💡 Tip',
            'pregunta': '❓ Pregunta',
            'reflexion': '🧠 Reflexión'
        };
        return map[category] || category;
    }

    function getCategoryIcon(category) {
        const map = {
            'logro': '🏆',
            'tip': '💡',
            'pregunta': '❓',
            'reflexion': '🧠'
        };
        return map[category] || '📝';
    }

    function getTimeAgo(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Ahora mismo';
        if (minutes < 60) return `Hace ${minutes} min`;
        if (hours < 24) return `Hace ${hours} h`;
        if (days === 1) return 'Ayer';
        if (days < 7) return `Hace ${days} días`;
        return date.toLocaleDateString('es-ES');
    }

    // ===== RENDERIZAR POSTS =====
    function renderPosts(category = 'all') {
        const filtered = category === 'all'
            ? posts
            : posts.filter(p => p.category === category);

        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

        if (postsCounter) postsCounter.textContent = `${filtered.length} publicaciones`;
        if (totalPostsStat) totalPostsStat.textContent = posts.length;

        if (posts.length > 0) {
            const sorted = [...posts].sort((a, b) => b.likes - a.likes);
            const top = sorted[0];
            if (popularPostStat) popularPostStat.textContent = top.content.substring(0, 30) + '...';
        }

        if (filtered.length === 0) {
            postsContainer.innerHTML = `
                <div class="empty-state-card">
                    <i class="ri-chat-smile-3-line"></i>
                    <h3>No hay publicaciones en esta categoría</h3>
                    <p class="text-help">Sé el primero en compartir algo con la comunidad.</p>
                    <button class="btn btn-primary" id="emptyStateCreateBtn">
                        <i class="ri-add-line"></i> Crear publicación
                    </button>
                </div>
            `;
            document.getElementById('emptyStateCreateBtn')?.addEventListener('click', openCreatePostModal);
            return;
        }

        postsContainer.innerHTML = filtered.map(post => {
            const isLiked = currentUser && post.likedBy && post.likedBy.includes(currentUser.id);
            const likeIcon = isLiked ? '❤️' : '🤍';
            const date = new Date(post.date);
            const timeAgo = getTimeAgo(date);
            const categoryIcon = getCategoryIcon(post.category);
            const categoryLabel = getCategoryLabel(post.category);

            return `
                <div class="post-card" data-id="${post.id}">
                    <div class="post-header">
                        <div class="post-author">
                            <span class="author-avatar">${post.authorAvatar || '👤'}</span>
                            <div>
                                <strong>${post.author}</strong>
                                <span class="post-time">${timeAgo}</span>
                            </div>
                        </div>
                        <span class="post-category">${categoryIcon} ${categoryLabel}</span>
                    </div>
                    <div class="post-content">
                        <p>${post.content}</p>
                    </div>
                    <div class="post-actions">
                        <button class="like-btn ${isLiked ? 'liked' : ''}" data-id="${post.id}">
                            <i class="ri-heart-${isLiked ? 'fill' : 'line'}"></i>
                            <span class="like-count">${post.likes}</span>
                        </button>
                        <button class="comment-btn" data-id="${post.id}">
                            <i class="ri-chat-3-line"></i>
                            <span class="comment-count">${post.comments ? post.comments.length : 0}</span>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Event listeners para likes y comentarios
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const id = this.dataset.id;
                toggleLike(id);
            });
        });

        document.querySelectorAll('.comment-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.dataset.id;
                openCommentsModal(id);
            });
        });
    }

    // ===== LIKES =====
    function toggleLike(postId) {
        if (!currentUser) {
            showToast('Inicia sesión para dar like', 'error');
            return;
        }
        const post = posts.find(p => p.id === postId);
        if (!post) return;

        if (!post.likedBy) post.likedBy = [];
        const index = post.likedBy.indexOf(currentUser.id);
        if (index > -1) {
            post.likedBy.splice(index, 1);
            post.likes--;
            showToast('Quitaste tu like', 'info');
        } else {
            post.likedBy.push(currentUser.id);
            post.likes++;
            showToast('¡Te gusta esta publicación! ❤️', 'success');
        }
        savePosts();
        const activeCategory = document.querySelector('#communityFilters .filter-btn.active')?.dataset.category || 'all';
        renderPosts(activeCategory);
    }

    // ===== MODALES =====
    function openCreatePostModal() {
        document.getElementById('createPostModal').style.display = 'flex';
        document.getElementById('postContent').value = '';
        document.getElementById('postCharCount').textContent = '0';
        document.getElementById('postCategory').value = 'logro';
    }

    function closeCreatePostModal() {
        document.getElementById('createPostModal').style.display = 'none';
    }

    function submitPost() {
        if (!currentUser) {
            showToast('Inicia sesión para publicar', 'error');
            return;
        }
        const content = document.getElementById('postContent').value.trim();
        if (!content) {
            showToast('Escribe algo para publicar', 'error');
            return;
        }
        if (content.length < 10) {
            showToast('El contenido debe tener al menos 10 caracteres', 'error');
            return;
        }

        const category = document.getElementById('postCategory').value;
        const newPost = {
            id: 'p' + Date.now(),
            author: currentUser.name || 'Usuario',
            authorAvatar: '👤',
            category: category,
            content: content,
            date: new Date().toISOString(),
            likes: 0,
            likedBy: [],
            comments: []
        };

        posts.unshift(newPost);
        savePosts();
        closeCreatePostModal();
        showToast('¡Publicación creada con éxito! 🎉', 'success');
        const activeCategory = document.querySelector('#communityFilters .filter-btn.active')?.dataset.category || 'all';
        renderPosts(activeCategory);
    }

    function openCommentsModal(postId) {
        currentPostIdForComments = postId;
        const post = posts.find(p => p.id === postId);
        if (!post) return;

        const modal = document.getElementById('commentsModal');
        const list = document.getElementById('commentsList');

        if (!post.comments || post.comments.length === 0) {
            list.innerHTML = `<p class="text-help" style="text-align:center; padding:20px;">No hay comentarios aún. ¡Sé el primero!</p>`;
        } else {
            list.innerHTML = post.comments.map(c => `
                <div class="comment-item">
                    <span class="comment-author">${c.author}</span>
                    <span class="comment-time">${getTimeAgo(new Date(c.date))}</span>
                    <p>${c.content}</p>
                </div>
            `).join('');
        }

        modal.style.display = 'flex';
        document.getElementById('commentInput').value = '';
    }

    function closeCommentsModal() {
        document.getElementById('commentsModal').style.display = 'none';
        currentPostIdForComments = null;
    }

    function submitComment() {
        if (!currentUser) {
            showToast('Inicia sesión para comentar', 'error');
            return;
        }
        if (!currentPostIdForComments) return;

        const input = document.getElementById('commentInput');
        const content = input.value.trim();
        if (!content) {
            showToast('Escribe un comentario', 'error');
            return;
        }

        const post = posts.find(p => p.id === currentPostIdForComments);
        if (!post) return;

        if (!post.comments) post.comments = [];
        post.comments.push({
            id: 'c' + Date.now(),
            author: currentUser.name || 'Usuario',
            content: content,
            date: new Date().toISOString()
        });

        savePosts();
        input.value = '';
        showToast('Comentario agregado ✅', 'success');
        openCommentsModal(currentPostIdForComments);
        const activeCategory = document.querySelector('#communityFilters .filter-btn.active')?.dataset.category || 'all';
        renderPosts(activeCategory);
    }

    // ===== FILTROS =====
    function setupFilters() {
        filterButtons.forEach(btn => {
            // Remover listeners previos para evitar duplicados
            btn.removeEventListener('click', handleFilterClick);
            btn.addEventListener('click', handleFilterClick);
        });
    }

    function handleFilterClick() {
        filterButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const category = this.dataset.category;
        renderPosts(category);
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
    document.getElementById('createPostBtn')?.addEventListener('click', openCreatePostModal);
    document.getElementById('closeCreatePostBtn')?.addEventListener('click', closeCreatePostModal);
    document.getElementById('cancelPostBtn')?.addEventListener('click', closeCreatePostModal);
    document.getElementById('submitPostBtn')?.addEventListener('click', submitPost);

    document.getElementById('closeCommentsBtn')?.addEventListener('click', closeCommentsModal);
    document.getElementById('commentsModal')?.addEventListener('click', function(e) {
        if (e.target === this) closeCommentsModal();
    });

    document.getElementById('submitCommentBtn')?.addEventListener('click', submitComment);
    document.getElementById('commentInput')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            submitComment();
        }
    });

    document.getElementById('postContent')?.addEventListener('input', function() {
        const count = this.value.length;
        document.getElementById('postCharCount').textContent = count;
        if (count > 500) {
            this.value = this.value.substring(0, 500);
            document.getElementById('postCharCount').textContent = 500;
        }
    });

    document.getElementById('createPostModal')?.addEventListener('click', function(e) {
        if (e.target === this) closeCreatePostModal();
    });

    // ===== INICIALIZAR =====
    function init() {
        loadPosts();
        setupFilters();
        const activeCategory = document.querySelector('#communityFilters .filter-btn.active')?.dataset.category || 'all';
        renderPosts(activeCategory);
    }

    // Ejecutar cuando la vista se carga
    init();
}

// ===== EJECUCIÓN CON viewLoaded =====
document.addEventListener('viewLoaded', function(e) {
    if (e.detail.viewId === 'community') {
        initCommunity();
    }
});

// También ejecutar si la vista ya está cargada (por si se recarga la página en esta vista)
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    if (document.getElementById('postsContainer')) {
        initCommunity();
    }
}