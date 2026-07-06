// teacher-home.js - Versión con viewLoaded
function initTeacherHome() {
    const userJson = sessionStorage.getItem('currentUser');
    if (userJson) {
        try {
            const user = JSON.parse(userJson);
            const nameEl = document.getElementById('welcomeName');
            if (nameEl) nameEl.textContent = user.name || 'Docente';
        } catch (e) {}
    }
    const goToBtn = document.getElementById('goToEmotionBtn');
    if (goToBtn) {
        goToBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const emotionItem = document.querySelector('.sidebar-item[data-view="teacher-emotion"]');
            if (emotionItem) emotionItem.click();
            else alert('La vista de registro emocional aún no está disponible.');
        });
    }
}

// Escuchar el evento personalizado que dispara dashboard.js
document.addEventListener('viewLoaded', function(e) {
    if (e.detail.viewId === 'teacher-home') {
        initTeacherHome();
    }
});

// También ejecutar inmediatamente si el script se carga después de que el DOM ya esté listo (por si acaso)
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initTeacherHome();
}
