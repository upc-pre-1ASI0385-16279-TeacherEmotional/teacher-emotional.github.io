// public/assets/scripts/teacher/teacher-emotion.js

function initTeacherEmotion() {
    'use strict';

    // ===== DOM ELEMENTS =====
    const emojiOptions = document.querySelectorAll('.emoji-option');
    const intensitySlider = document.getElementById('intensitySlider');
    const intensityValue = document.getElementById('intensityValue');
    const noteText = document.getElementById('noteText');
    const charCount = document.getElementById('charCount');
    const stressTagsContainer = document.getElementById('stressTagsContainer');
    const stressTags = document.querySelectorAll('.etiqueta');
    const saveBtn = document.getElementById('saveEmotionBtn');
    const feedbackDiv = document.getElementById('emotionFeedback');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const selectedEmojiLabel = document.getElementById('selectedEmojiLabel');
    const currentDateSpan = document.getElementById('currentDate');
    const recordTypeInfo = document.getElementById('recordTypeInfo');
    const currentTimeSpan = document.getElementById('currentTime');
    const recordTypeIcon = document.getElementById('recordTypeIcon');
    const recordTypeText = document.getElementById('recordTypeText');
    const emotionForm = document.getElementById('emotionForm');

    // Si faltan elementos, salir (puede ser que la vista no esté completamente cargada)
    if (!emotionForm || !emojiOptions.length) {
        console.warn('Elementos de teacher-emotion no encontrados');
        return;
    }

    // ===== ESTADO =====
    let selectedEmoji = null;
    let selectedTags = [];
    let isSaving = false;

    // ===== FECHA Y HORA =====
    const now = new Date();
    const dateStr = now.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const timeStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    if (currentDateSpan) currentDateSpan.textContent = dateStr;
    if (currentTimeSpan) currentTimeSpan.textContent = timeStr;

    // ===== TIPO DE REGISTRO =====
    const hour = now.getHours();
    const user = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    let recordType = 'Normal';
    let recordTypeIconEmoji = '📝';

    const stored = localStorage.getItem('teacherEmotionalData');
    let todayRecords = [];
    if (stored) {
        try {
            const data = JSON.parse(stored);
            const todayStr = now.toISOString().split('T')[0];
            if (data.emotionalRecords && user.id) {
                todayRecords = data.emotionalRecords.filter(r => r.userId === user.id && r.date === todayStr);
            }
        } catch(e) {}
    }

    const hasMorningRecord = todayRecords.some(r => r.type && r.type.includes('Inicio'));
    const hasEveningRecord = todayRecords.some(r => r.type && r.type.includes('Fin'));

    if (hour < 12 && !hasMorningRecord) {
        recordType = 'Inicio de jornada 🌅';
        recordTypeIconEmoji = '🌅';
    } else if (hour >= 14 && !hasEveningRecord && hasMorningRecord) {
        recordType = 'Fin de jornada 🌇';
        recordTypeIconEmoji = '🌇';
    } else if (hour >= 14 && !hasMorningRecord) {
        recordType = 'Registro único (sin inicio previo) 📌';
        recordTypeIconEmoji = '📌';
    } else if (hour < 12 && hasMorningRecord) {
        recordType = 'Ya registraste hoy (mañana) ☀️';
        recordTypeIconEmoji = '☀️';
    } else if (hour >= 14 && hasEveningRecord) {
        recordType = 'Ya registraste hoy (tarde) 🌙';
        recordTypeIconEmoji = '🌙';
    }

    if (recordTypeIcon) recordTypeIcon.textContent = recordTypeIconEmoji;
    if (recordTypeText) {
        recordTypeText.textContent = recordType.replace(/[🌅🌇📌☀️🌙]/g, '').trim() || 'Normal';
    }
    if (recordTypeInfo) recordTypeInfo.textContent = recordType;

    // ===== CONTADOR DE CARACTERES =====
    if (noteText) {
        noteText.addEventListener('input', () => {
            const count = noteText.value.length;
            if (charCount) charCount.textContent = count;
            if (count > 500) {
                noteText.value = noteText.value.substring(0, 500);
                if (charCount) charCount.textContent = 500;
            }
        });
    }

    // ===== SELECCIÓN DE EMOJI =====
    emojiOptions.forEach(option => {
        option.addEventListener('click', () => {
            emojiOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedEmoji = option.dataset.emoji;
            const label = option.dataset.label;
            if (selectedEmojiLabel) {
                selectedEmojiLabel.textContent = `Has seleccionado: ${label} (${selectedEmoji})`;
                selectedEmojiLabel.style.color = 'var(--primary-dark)';
                selectedEmojiLabel.style.fontWeight = '600';
            }

            const negativeEmojis = ['😢', '😕'];
            if (negativeEmojis.includes(selectedEmoji)) {
                if (stressTagsContainer) stressTagsContainer.style.display = 'block';
            } else {
                if (stressTagsContainer) stressTagsContainer.style.display = 'none';
                selectedTags = [];
                stressTags.forEach(tag => tag.classList.remove('selected'));
            }

            if (saveBtn) saveBtn.disabled = false;
        });
    });

    // ===== ETIQUETAS DE ESTRÉS =====
    stressTags.forEach(tag => {
        tag.addEventListener('click', () => {
            tag.classList.toggle('selected');
            const tagValue = tag.dataset.tag;
            if (selectedTags.includes(tagValue)) {
                selectedTags = selectedTags.filter(t => t !== tagValue);
            } else {
                selectedTags.push(tagValue);
            }
        });
    });

    // ===== INTENSIDAD =====
    if (intensitySlider) {
        intensitySlider.addEventListener('input', () => {
            const val = parseInt(intensitySlider.value);
            if (intensityValue) intensityValue.textContent = val;
            if (intensityValue) {
                if (val <= 2) {
                    intensityValue.style.color = 'var(--primary-light)';
                } else if (val === 3) {
                    intensityValue.style.color = 'var(--accent-gold)';
                } else {
                    intensityValue.style.color = 'var(--secondary-warm)';
                }
            }
        });
        // Inicializar color
        if (intensityValue) intensityValue.style.color = 'var(--accent-gold)';
    }

    // ===== GUARDAR REGISTRO =====
    async function saveEmotion(e) {
        e.preventDefault();
        if (isSaving) return;
        if (!selectedEmoji) {
            showToast('Por favor selecciona una emoción', 'error');
            return;
        }

        isSaving = true;
        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Guardando...';
        }

        const recordData = {
            userId: user.id || 'unknown',
            emoji: selectedEmoji,
            intensity: parseInt(intensitySlider ? intensitySlider.value : 3),
            note: noteText ? noteText.value.trim() : '',
            tags: selectedTags,
            type: recordType,
            date: now.toISOString().split('T')[0],
            timestamp: now.toISOString()
        };

        try {
            await new Promise(resolve => setTimeout(resolve, 800));

            let data = stored ? JSON.parse(stored) : { emotionalRecords: [], users: [], favoriteResources: {}, auditLog: [] };
            if (!data.emotionalRecords) data.emotionalRecords = [];
            data.emotionalRecords.push(recordData);
            localStorage.setItem('teacherEmotionalData', JSON.stringify(data));

            if (feedbackMessage) feedbackMessage.textContent = '¡Registro guardado con éxito! ✅';
            if (feedbackDiv) {
                feedbackDiv.style.display = 'block';
                feedbackDiv.className = 'emotion-feedback success';
            }

            showToast('Registro emocional guardado correctamente', 'success');

            setTimeout(() => {
                if (feedbackDiv) feedbackDiv.style.display = 'none';
                resetForm();
            }, 2000);

        } catch (error) {
            console.error('Error al guardar:', error);
            if (feedbackMessage) feedbackMessage.textContent = 'Error al guardar. Intenta de nuevo.';
            if (feedbackDiv) {
                feedbackDiv.style.display = 'block';
                feedbackDiv.className = 'emotion-feedback error';
            }
            setTimeout(() => {
                if (feedbackDiv) feedbackDiv.style.display = 'none';
            }, 3000);
            showToast('Error al guardar', 'error');
        } finally {
            isSaving = false;
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.innerHTML = '<i class="ri-check-line"></i> Guardar registro';
            }
        }
    }

    function resetForm() {
        emojiOptions.forEach(opt => opt.classList.remove('selected'));
        selectedEmoji = null;
        if (intensitySlider) intensitySlider.value = 3;
        if (intensityValue) {
            intensityValue.textContent = '3';
            intensityValue.style.color = 'var(--accent-gold)';
        }
        if (noteText) noteText.value = '';
        if (charCount) charCount.textContent = '0';
        if (stressTagsContainer) stressTagsContainer.style.display = 'none';
        stressTags.forEach(tag => tag.classList.remove('selected'));
        selectedTags = [];
        if (saveBtn) saveBtn.disabled = true;
        if (selectedEmojiLabel) {
            selectedEmojiLabel.textContent = 'Selecciona un emoji para continuar';
            selectedEmojiLabel.style.color = 'var(--text-muted)';
            selectedEmojiLabel.style.fontWeight = '400';
        }
    }

    // ===== EVENTOS =====
    if (emotionForm) emotionForm.addEventListener('submit', saveEmotion);

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
    if (saveBtn) saveBtn.disabled = true;
}

// ===== EJECUCIÓN CON viewLoaded =====
document.addEventListener('viewLoaded', function(e) {
    if (e.detail.viewId === 'teacher-emotion') {
        initTeacherEmotion();
    }
});

// También ejecutar inmediatamente si la vista ya está cargada (por si el script se carga después del viewLoaded)
// Por ejemplo, si se recarga la página y el viewLoaded ya pasó, pero la vista es la actual.
// Usamos un pequeño timeout para dar tiempo a que el DOM se actualice.
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    // Verificar si la vista actual es teacher-emotion (buscando un elemento único)
    if (document.getElementById('emotionForm')) {
        initTeacherEmotion();
    }
}