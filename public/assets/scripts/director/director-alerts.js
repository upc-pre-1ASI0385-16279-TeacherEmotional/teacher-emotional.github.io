(function() {
    'use strict';

    // ===== DOM REFS =====
    const thresholdSlider = document.getElementById('alertThreshold');
    const thresholdDisplay = document.getElementById('thresholdDisplay');
    const alertThresholdDisplay = document.getElementById('alertThresholdDisplay');
    const saveThresholdBtn = document.getElementById('saveThresholdBtn');
    const alertsContainer = document.getElementById('alertsContainer');
    const historyContainer = document.getElementById('historyContainer');
    const alertsCount = document.getElementById('alertsCount');
    const historyCount = document.getElementById('historyCount');
    const totalAlertsEl = document.getElementById('totalAlerts');
    const recentAlertsEl = document.getElementById('recentAlerts');
    const currentRiskEl = document.getElementById('currentRisk');
    const refreshBtn = document.getElementById('refreshAlertsBtn');
    const simulateBtn = document.getElementById('simulateSosBtn');
    const sosModal = document.getElementById('sosConfirmModal');
    const closeSosModal = document.getElementById('closeSosModal');
    const cancelSos = document.getElementById('cancelSos');
    const confirmSos = document.getElementById('confirmSos');

    // ===== ESTADO =====
    let currentThreshold = 40;
    let alertHistory = [];

    // ===== CARGAR DATOS =====
    function loadData() {
        const stored = localStorage.getItem('teacherEmotionalData');
        const data = stored ? JSON.parse(stored) : { users: [], emotionalRecords: [] };

        // Obtener umbral del directivo
        const director = data.users.find(u => u.role === 'director');
        currentThreshold = director?.institutionConfig?.alertThreshold || 40;
        thresholdSlider.value = currentThreshold;
        thresholdDisplay.textContent = currentThreshold + '%';
        alertThresholdDisplay.textContent = currentThreshold + '%';

        // Cargar historial de alertas (guardado en data.alertHistory)
        alertHistory = data.alertHistory || [];

        // Analizar registros y generar alertas
        generateAlerts(data);
    }

    // ===== GENERAR ALERTAS =====
    function generateAlerts(data) {
        const records = data.emotionalRecords || [];
        const users = data.users || [];

        // Agrupar registros por área (departamento o nivel)
        const areas = {};

        records.forEach(record => {
            const user = users.find(u => u.id === record.userId);
            if (!user) return;
            const area = user.department || user.level || 'General';
            if (!areas[area]) areas[area] = { total: 0, negative: 0 };
            areas[area].total++;
            if (record.emoji === '😢' || record.emoji === '😕') {
                areas[area].negative++;
            }
        });

        // Calcular porcentaje de negatividad por área
        const alertas = [];
        const now = new Date();
        const today = now.toISOString().split('T')[0];

        Object.entries(areas).forEach(([area, stats]) => {
            if (stats.total === 0) return;
            const percentage = Math.round((stats.negative / stats.total) * 100);
            if (percentage >= currentThreshold) {
                const severity = percentage >= 70 ? 'critical' :
                    percentage >= 50 ? 'high' :
                        percentage >= 35 ? 'medium' : 'low';

                // Verificar si ya hay una alerta activa para esta área
                const existing = alertHistory.filter(a =>
                    a.area === area &&
                    a.resolved === false &&
                    new Date(a.date).toDateString() === now.toDateString()
                );

                if (existing.length === 0) {
                    // Crear nueva alerta
                    const newAlert = {
                        id: Date.now() + '-' + Math.random().toString(36).substr(2, 4),
                        area: area,
                        percentage: percentage,
                        severity: severity,
                        date: now.toISOString(),
                        resolved: false,
                        details: `${percentage}% de emociones negativas en ${area}`
                    };
                    alertHistory.push(newAlert);
                } else {
                    // Actualizar la existente
                    existing[0].percentage = percentage;
                    existing[0].severity = severity;
                    existing[0].details = `${percentage}% de emociones negativas en ${area}`;
                }
            }
        });

        // Guardar historial actualizado
        const stored = localStorage.getItem('teacherEmotionalData');
        const dataToSave = stored ? JSON.parse(stored) : {};
        dataToSave.alertHistory = alertHistory;
        localStorage.setItem('teacherEmotionalData', JSON.stringify(dataToSave));

        renderAlerts();
    }

    // ===== RENDERIZAR ALERTAS =====
    function renderAlerts() {
        const active = alertHistory.filter(a => !a.resolved);
        const recent = alertHistory.slice(0, 20);

        // Estadísticas
        totalAlertsEl.textContent = alertHistory.length;
        const last24h = alertHistory.filter(a => {
            const diff = Date.now() - new Date(a.date).getTime();
            return diff < 24 * 60 * 60 * 1000;
        });
        recentAlertsEl.textContent = last24h.length;

        // Nivel de riesgo actual (basado en la alerta más severa activa)
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        const maxSeverity = active.reduce((max, a) => {
            const level = severityOrder[a.severity] || 0;
            return level > max ? level : max;
        }, 0);

        const riskLabels = ['Bajo', 'Medio', 'Alto', 'Crítico'];
        const riskColors = ['var(--primary-light)', 'var(--accent-gold)', 'var(--secondary-warm)', '#dc2626'];
        const riskIndex = Math.min(maxSeverity, 3);
        currentRiskEl.textContent = active.length > 0 ? riskLabels[riskIndex] : 'Bajo';
        currentRiskEl.style.color = active.length > 0 ? riskColors[riskIndex] : 'var(--primary-light)';

        // Alertas activas
        alertsCount.textContent = `${active.length} alertas`;
        if (active.length === 0) {
            alertsContainer.innerHTML = `
                    <div class="empty-alerts">
                        <i class="ri-check-double-line"></i>
                        <p>No hay alertas activas. ¡El equipo está en buen estado!</p>
                    </div>
                `;
        } else {
            alertsContainer.innerHTML = active.map(a => `
                    <div class="alert-item severity-${a.severity}">
                        <div class="alert-icon">${getSeverityIcon(a.severity)}</div>
                        <div class="alert-content">
                            <div class="alert-title">
                                <strong>${a.area}</strong>
                                <span class="alert-badge severity-${a.severity}">${getSeverityLabel(a.severity)}</span>
                            </div>
                            <p>${a.details}</p>
                            <span class="alert-time">${formatTime(a.date)}</span>
                        </div>
                        <button class="alert-resolve-btn" data-id="${a.id}">✓ Resolver</button>
                    </div>
                `).join('');

            // Event listener para resolver alertas
            document.querySelectorAll('.alert-resolve-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.dataset.id;
                    resolveAlert(id);
                });
            });
        }

        // Historial
        historyCount.textContent = `${alertHistory.length} registros`;
        const sortedHistory = [...alertHistory].sort((a, b) => new Date(b.date) - new Date(a.date));
        if (sortedHistory.length === 0) {
            historyContainer.innerHTML = `
                    <div class="empty-alerts">
                        <i class="ri-file-list-line"></i>
                        <p>No hay registros en el historial.</p>
                    </div>
                `;
        } else {
            historyContainer.innerHTML = sortedHistory.slice(0, 15).map(a => `
                    <div class="history-item">
                        <div class="history-icon ${a.resolved ? 'resolved' : ''}">
                            ${a.resolved ? '✅' : getSeverityIcon(a.severity)}
                        </div>
                        <div class="history-content">
                            <span class="history-area">${a.area}</span>
                            <span class="history-detail">${a.details}</span>
                            <span class="history-time">${formatTime(a.date)}</span>
                        </div>
                        <span class="history-status ${a.resolved ? 'resolved' : 'active'}">
                            ${a.resolved ? 'Resuelta' : 'Activa'}
                        </span>
                    </div>
                `).join('');
        }
    }

    // ===== HELPER: SEVERIDAD =====
    function getSeverityIcon(severity) {
        const icons = {
            critical: '🔴',
            high: '🟠',
            medium: '🟡',
            low: '🟢'
        };
        return icons[severity] || '🟡';
    }

    function getSeverityLabel(severity) {
        const labels = {
            critical: 'Crítico',
            high: 'Alto',
            medium: 'Medio',
            low: 'Bajo'
        };
        return labels[severity] || 'Medio';
    }

    function formatTime(dateStr) {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now - date;
        if (diff < 60000) return 'Hace un momento';
        if (diff < 3600000) return `Hace ${Math.floor(diff/60000)} min`;
        if (diff < 86400000) return `Hace ${Math.floor(diff/3600000)} h`;
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    // ===== RESOLVER ALERTA =====
    function resolveAlert(id) {
        const alert = alertHistory.find(a => a.id === id);
        if (alert) {
            alert.resolved = true;
            const stored = localStorage.getItem('teacherEmotionalData');
            const data = stored ? JSON.parse(stored) : {};
            data.alertHistory = alertHistory;
            localStorage.setItem('teacherEmotionalData', JSON.stringify(data));
            renderAlerts();
            showToast('✅ Alerta resuelta correctamente', 'success');
        }
    }

    // ===== GUARDAR UMBRAL =====
    function saveThreshold() {
        const value = parseInt(thresholdSlider.value);
        const stored = localStorage.getItem('teacherEmotionalData');
        const data = stored ? JSON.parse(stored) : { users: [] };
        const director = data.users.find(u => u.role === 'director');
        if (director) {
            if (!director.institutionConfig) director.institutionConfig = {};
            director.institutionConfig.alertThreshold = value;
            localStorage.setItem('teacherEmotionalData', JSON.stringify(data));
            currentThreshold = value;
            alertThresholdDisplay.textContent = value + '%';
            showToast(`✅ Umbral configurado al ${value}%`, 'success');
            // Regenerar alertas con el nuevo umbral
            generateAlerts(data);
        } else {
            showToast('No se encontró un usuario directivo', 'error');
        }
    }

    // ===== SIMULAR SOS =====
    function triggerSos() {
        // Crear una alerta SOS en el historial
        const sosAlert = {
            id: 'sos-' + Date.now(),
            area: '🚨 EMERGENCIA',
            percentage: 100,
            severity: 'critical',
            date: new Date().toISOString(),
            resolved: false,
            details: 'Alerta SOS activada por un docente (simulación)'
        };
        alertHistory.push(sosAlert);
        const stored = localStorage.getItem('teacherEmotionalData');
        const data = stored ? JSON.parse(stored) : {};
        data.alertHistory = alertHistory;
        localStorage.setItem('teacherEmotionalData', JSON.stringify(data));
        renderAlerts();
        showToast('🆘 Alerta SOS simulada enviada correctamente', 'error');
        sosModal.style.display = 'none';
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
    // Slider
    thresholdSlider.addEventListener('input', () => {
        thresholdDisplay.textContent = thresholdSlider.value + '%';
    });

    // Guardar umbral
    saveThresholdBtn.addEventListener('click', saveThreshold);

    // Simular SOS
    simulateBtn.addEventListener('click', () => {
        sosModal.style.display = 'flex';
    });
    closeSosModal.addEventListener('click', () => sosModal.style.display = 'none');
    cancelSos.addEventListener('click', () => sosModal.style.display = 'none');
    confirmSos.addEventListener('click', triggerSos);
    sosModal.addEventListener('click', (e) => {
        if (e.target === sosModal) sosModal.style.display = 'none';
    });

    // Actualizar datos
    refreshBtn.addEventListener('click', () => {
        const stored = localStorage.getItem('teacherEmotionalData');
        const data = stored ? JSON.parse(stored) : {};
        generateAlerts(data);
        showToast('🔄 Datos actualizados', 'info');
    });

    // ===== INICIALIZAR =====
    loadData();

    // Recargar cuando la vista se active
    document.addEventListener('viewLoaded', function(e) {
        if (e.detail.viewId === 'director-alerts') {
            loadData();
        }
    });

})();