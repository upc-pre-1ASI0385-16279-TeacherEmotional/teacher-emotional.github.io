(function() {
    'use strict';

    // ===== VARIABLES GLOBALES =====
    let chartInstance = null;
    let currentPeriod = 'week';
    const user = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    let allRecords = [];

    // ===== GENERAR DATOS DE EJEMPLO PARA EL USUARIO =====
    function generateMockRecordsForUser(userId) {
        const emojis = ['😢', '😕', '😐', '🙂', '😄'];
        const intensidades = [1, 2, 3, 4, 5];
        const etiquetas = [
            'Sobrecarga de horas', 'Conductas disruptivas', 'Falta de recursos',
            'Presión por evaluaciones', 'Conflictos con colegas', 'Problemas personales'
        ];
        const notas = [
            'Día difícil, mucho trabajo',
            'Me siento bien, luego de enseñar',
            'Todo normal, sin novedades',
            'Estresante, pero llevadero',
            'Excelente día, los estudiantes respondieron bien',
            'Cansancio acumulado',
            'Reunión con padres muy tensa',
            'Problemas personales afectan mi ánimo',
            'Clase muy dinámica, me siento satisfecho',
            'Necesito mejorar mi gestión del tiempo'
        ];

        const records = [];
        const now = new Date();
        const today = now.toISOString().split('T')[0];

        // Generar registros para los últimos 30 días (1-3 por día)
        for (let d = 0; d < 30; d++) {
            const date = new Date(now);
            date.setDate(date.getDate() - d);
            const dateStr = date.toISOString().split('T')[0];
            // Número de registros: 1 a 3 por día
            const numRecords = Math.floor(Math.random() * 3) + 1;
            for (let r = 0; r < numRecords; r++) {
                const emoji = emojis[Math.floor(Math.random() * emojis.length)];
                const intensity = intensidades[Math.floor(Math.random() * intensidades.length)];
                const note = notas[Math.floor(Math.random() * notas.length)];
                const tags = [];
                if (emoji === '😢' || emoji === '😕') {
                    const numTags = Math.floor(Math.random() * 2) + 1;
                    for (let t = 0; t < numTags; t++) {
                        const tag = etiquetas[Math.floor(Math.random() * etiquetas.length)];
                        if (!tags.includes(tag)) tags.push(tag);
                    }
                }
                const hour = Math.floor(Math.random() * 24);
                let type = 'Normal';
                if (hour < 8) type = 'Inicio de jornada';
                else if (hour > 18) type = 'Fin de jornada';

                records.push({
                    id: `mock_rec_${Date.now()}_${Math.random()}`,
                    userId: userId,
                    date: dateStr,
                    emoji: emoji,
                    intensity: intensity,
                    note: note,
                    tags: tags,
                    type: type,
                    timestamp: new Date(date.getTime() + hour * 3600000 + Math.random() * 3600000).toISOString()
                });
            }
        }

        // Ordenar por fecha (más reciente primero)
        records.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        return records;
    }

    // ===== CARGAR REGISTROS =====
    function loadRecords() {
        const stored = localStorage.getItem('teacherEmotionalData');
        let data = stored ? JSON.parse(stored) : { emotionalRecords: [], users: [], favoriteResources: {}, auditLog: [] };

        // Si hay datos y el usuario tiene registros, usarlos
        if (data.emotionalRecords && user.id) {
            const userRecords = data.emotionalRecords.filter(r => r.userId === user.id);
            if (userRecords.length >= 3) {
                allRecords = userRecords;
                allRecords.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                return;
            }
        }

        // Si no hay registros suficientes, generar datos de ejemplo
        console.log('Generando datos de ejemplo para el historial del docente...');
        const mockRecords = generateMockRecordsForUser(user.id || 'unknown');

        // Guardar en localStorage (fusionar con los datos existentes)
        if (!data.emotionalRecords) data.emotionalRecords = [];
        // Eliminar posibles registros mock antiguos para evitar duplicados
        data.emotionalRecords = data.emotionalRecords.filter(r => r.userId !== user.id);
        data.emotionalRecords = data.emotionalRecords.concat(mockRecords);
        localStorage.setItem('teacherEmotionalData', JSON.stringify(data));

        allRecords = mockRecords;
        allRecords.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    // ===== FILTRAR POR PERÍODO =====
    function filterRecordsByPeriod(period) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        return allRecords.filter(r => {
            const recordDate = new Date(r.timestamp);
            if (period === 'week') {
                const weekAgo = new Date(today);
                weekAgo.setDate(weekAgo.getDate() - 7);
                return recordDate >= weekAgo;
            } else if (period === 'month') {
                const monthAgo = new Date(today);
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                return recordDate >= monthAgo;
            }
            return true; // 'all'
        });
    }

    // ===== ACTUALIZAR ESTADÍSTICAS =====
    function updateStats(records) {
        const total = records.length;
        document.getElementById('totalRecords').textContent = total;

        // Racha (días consecutivos desde el último registro)
        if (total > 0) {
            const sorted = [...records].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            let streak = 1;
            let currentDate = new Date(sorted[sorted.length - 1].timestamp);
            currentDate.setHours(0,0,0,0);

            for (let i = sorted.length - 2; i >= 0; i--) {
                const prevDate = new Date(sorted[i].timestamp);
                prevDate.setHours(0,0,0,0);
                const diffDays = (currentDate - prevDate) / (1000 * 60 * 60 * 24);
                if (diffDays === 1) {
                    streak++;
                    currentDate = prevDate;
                } else if (diffDays > 1) {
                    break;
                }
            }
            document.getElementById('streakCount').textContent = streak;
        } else {
            document.getElementById('streakCount').textContent = '0';
        }

        // Emoción más frecuente
        if (total > 0) {
            const emojiCount = {};
            records.forEach(r => {
                const emoji = r.emoji || '😐';
                emojiCount[emoji] = (emojiCount[emoji] || 0) + 1;
            });
            let maxEmoji = '😐';
            let maxCount = 0;
            for (const [emoji, count] of Object.entries(emojiCount)) {
                if (count > maxCount) {
                    maxCount = count;
                    maxEmoji = emoji;
                }
            }
            document.getElementById('mostCommonEmoji').textContent = `${maxEmoji} (${maxCount})`;
        } else {
            document.getElementById('mostCommonEmoji').textContent = '-';
        }

        // Intensidad promedio
        if (total > 0) {
            const totalIntensity = records.reduce((sum, r) => sum + (r.intensity || 3), 0);
            const avg = (totalIntensity / total).toFixed(1);
            document.getElementById('avgIntensity').textContent = avg + '/5';
        } else {
            document.getElementById('avgIntensity').textContent = '-';
        }

        // Primer registro
        if (total > 0) {
            const oldest = [...records].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))[0];
            const date = new Date(oldest.timestamp);
            document.getElementById('firstRecordDate').textContent = date.toLocaleDateString('es-ES');
        } else {
            document.getElementById('firstRecordDate').textContent = '-';
        }
    }

    // ===== RENDERIZAR LISTA DE REGISTROS =====
    function renderRecordsList(records) {
        const container = document.getElementById('recentRecordsList');
        const countSpan = document.getElementById('recordsCount');
        const limit = 10;
        const displayRecords = records.slice(0, limit);

        countSpan.textContent = `${records.length} registros`;

        if (records.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="ri-inbox-line"></i>
                    <p>Aún no tienes registros emocionales.</p>
                    <p class="text-help">¡Comienza hoy mismo!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = displayRecords.map(r => {
            const date = new Date(r.timestamp);
            const dateStr = date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
            const timeStr = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
            const intensity = r.intensity || 3;
            const intensityStars = '★'.repeat(intensity) + '☆'.repeat(5 - intensity);

            return `
                <div class="record-item">
                    <div class="record-emoji">${r.emoji || '😐'}</div>
                    <div class="record-details">
                        <div class="record-header">
                            <span class="record-date">${dateStr}</span>
                            <span class="record-time">${timeStr}</span>
                            <span class="record-type">${r.type || 'Normal'}</span>
                        </div>
                        <div class="record-intensity">${intensityStars}</div>
                        ${r.note ? `<p class="record-note">${r.note}</p>` : ''}
                        ${r.tags && r.tags.length > 0 ? `<div class="record-tags">${r.tags.map(t => `<span class="tag-small">${t}</span>`).join('')}</div>` : ''}
                    </div>
                </div>
            `;
        }).join('');

        if (records.length > limit) {
            container.innerHTML += `
                <div class="show-more">
                    <span class="text-help">Mostrando ${limit} de ${records.length} registros</span>
                </div>
            `;
        }
    }

    // ===== RENDERIZAR GRÁFICO =====
    function renderChart(records) {
        const canvas = document.getElementById('historyChart');
        if (!canvas) {
            console.warn('Canvas no encontrado');
            return;
        }
        if (chartInstance) {
            chartInstance.destroy();
            chartInstance = null;
        }

        const ctx = canvas.getContext('2d');
        const parent = canvas.parentElement;

        // Limpiar mensaje anterior si existe
        const emptyMsg = parent.querySelector('.empty-chart');
        if (emptyMsg) emptyMsg.remove();
        canvas.style.display = 'block';

        if (records.length === 0) {
            canvas.style.display = 'none';
            const msg = document.createElement('div');
            msg.className = 'empty-chart';
            msg.innerHTML = `
                <i class="ri-bar-chart-2-line"></i>
                <p>No hay datos suficientes para mostrar el gráfico.</p>
                <p class="text-help">Registra tus emociones para ver tu evolución.</p>
            `;
            parent.appendChild(msg);
            return;
        }

        // Agrupar por día y calcular promedio de intensidad
        const dailyData = {};
        const sortedRecords = [...records].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        sortedRecords.forEach(r => {
            const date = new Date(r.timestamp);
            const key = date.toISOString().split('T')[0];
            if (!dailyData[key]) {
                dailyData[key] = { sum: 0, count: 0 };
            }
            dailyData[key].sum += (r.intensity || 3);
            dailyData[key].count += 1;
        });

        const labels = Object.keys(dailyData);
        const dataPoints = labels.map(key => {
            const d = dailyData[key];
            return (d.sum / d.count).toFixed(1);
        });

        if (dataPoints.length < 2) {
            canvas.style.display = 'none';
            const msg = document.createElement('div');
            msg.className = 'empty-chart';
            msg.innerHTML = `
                <i class="ri-bar-chart-2-line"></i>
                <p>Se necesitan al menos 2 días de registros para mostrar el gráfico.</p>
                <p class="text-help">¡Sigue registrando!</p>
            `;
            parent.appendChild(msg);
            return;
        }

        const formattedLabels = labels.map(key => {
            const d = new Date(key);
            return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });
        });

        chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: formattedLabels,
                datasets: [{
                    label: 'Intensidad promedio diaria',
                    data: dataPoints,
                    backgroundColor: 'rgba(44, 122, 123, 0.7)',
                    borderColor: '#2C7A7B',
                    borderWidth: 2,
                    borderRadius: 4,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = parseFloat(context.raw);
                                return `Intensidad: ${value.toFixed(1)}/5`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        min: 0,
                        max: 5,
                        ticks: {
                            stepSize: 1,
                            callback: function(value) {
                                const labels = ['😢', '😕', '😐', '🙂', '😄'];
                                return labels[value - 1] || value;
                            }
                        }
                    }
                }
            }
        });
    }

    // ===== ACTUALIZAR TODO =====
    function updateDashboard(period) {
        const filtered = filterRecordsByPeriod(period);
        updateStats(filtered);
        renderRecordsList(filtered);
        renderChart(filtered);
    }

    // ===== CONFIGURAR FILTROS =====
    function setupFilters() {
        const buttons = document.querySelectorAll('.period-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', function() {
                buttons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentPeriod = this.dataset.period;
                updateDashboard(currentPeriod);
            });
        });
    }

    // ===== TIP DEL DÍA =====
    function setDailyTip() {
        const tips = [
            'Cada registro es un paso hacia un mejor autoconocimiento. ¡Sigue así!',
            'La constancia es clave. Registra cada día para ver tu evolución real.',
            'No olvides que tus emociones son válidas. Registrar te ayuda a procesarlas.',
            'Identificar patrones emocionales te permite tomar mejores decisiones.',
            'Una racha de 30 días de registro puede cambiar tu perspectiva emocional.',
            'Comparte tus logros con la comunidad. ¡Motiva a otros docentes!',
            'Recuerda: el bienestar emocional es un viaje, no un destino.'
        ];
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        const tipEl = document.getElementById('dailyTip');
        if (tipEl) tipEl.textContent = randomTip;
    }

    // ===== INICIALIZAR =====
    function init() {
        loadRecords();
        setupFilters();
        setDailyTip();
        updateDashboard('week');
    }

    // ===== FUNCIÓN PARA CARGAR CHART.JS SI ES NECESARIO =====
    function ensureChartJs(callback) {
        if (typeof Chart !== 'undefined') {
            callback();
        } else {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
            script.onload = callback;
            document.head.appendChild(script);
        }
    }

    // ===== ESCUCHAR EVENTO VIEWLOADED =====
    document.addEventListener('viewLoaded', function(e) {
        if (e.detail.viewId === 'teacher-history') {
            ensureChartJs(init);
        }
    });

    // ===== EJECUTAR SI LA PÁGINA SE CARGA DIRECTAMENTE =====
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        if (document.getElementById('historyChart')) {
            ensureChartJs(init);
        }
    }

})();