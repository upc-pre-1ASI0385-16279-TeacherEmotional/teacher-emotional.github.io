// public/assets/scripts/director/director-analytics.js

(function() {
    'use strict';

    // ===== ELEMENTOS DOM =====
    const levelFilter = document.getElementById('levelFilter');
    const deptFilter = document.getElementById('deptFilter');
    const periodFilter = document.getElementById('periodFilter');
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    const refreshBtn = document.getElementById('refreshDataBtn');
    const alertDetailsBtn = document.getElementById('alertDetailsBtn');
    const alertBanner = document.getElementById('alertBanner');
    const alertMessage = document.getElementById('alertMessage');

    // Verificar que los elementos principales existen
    if (!levelFilter || !deptFilter || !periodFilter) {
        console.warn('Elementos de director-analytics no encontrados');
        return;
    }

    // ===== VARIABLES GLOBALES =====
    let chartWeekly = null;
    let chartMonthly = null;
    let allRecords = [];
    let allUsers = [];
    let currentFilters = {
        level: '',
        department: '',
        period: 'month'
    };

    // ===== CARGAR DATOS =====
    function loadData() {
        const stored = localStorage.getItem('teacherEmotionalData');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                allRecords = data.emotionalRecords || [];
                allUsers = data.users || [];
            } catch(e) {
                console.error('Error cargando datos:', e);
            }
        }
    }

    // ===== OBTENER USUARIOS DOCENTES =====
    function getTeachers() {
        return allUsers.filter(u => u.role === 'teacher' && u.active);
    }

    // ===== FILTRAR REGISTROS =====
    function filterRecords() {
        const level = currentFilters.level;
        const department = currentFilters.department;
        const period = currentFilters.period;

        let teacherIds = getTeachers()
            .filter(t => {
                if (level && t.level !== level) return false;
                if (department && t.department !== department) return false;
                return true;
            })
            .map(t => t.id);

        let filtered = allRecords.filter(r => teacherIds.includes(r.userId));

        const now = new Date();
        const cutoff = new Date(now);
        if (period === 'week') {
            cutoff.setDate(cutoff.getDate() - 7);
        } else if (period === 'month') {
            cutoff.setMonth(cutoff.getMonth() - 1);
        } else if (period === 'quarter') {
            cutoff.setMonth(cutoff.getMonth() - 3);
        }
        filtered = filtered.filter(r => new Date(r.timestamp) >= cutoff);

        return filtered;
    }

    // ===== ACTUALIZAR ESTADÍSTICAS =====
    function updateStats(records) {
        const teachers = getTeachers();
        const filteredTeachers = teachers.filter(t => {
            if (currentFilters.level && t.level !== currentFilters.level) return false;
            if (currentFilters.department && t.department !== currentFilters.department) return false;
            return true;
        });

        document.getElementById('totalTeachers').textContent = filteredTeachers.length;

        if (records.length > 0) {
            const total = records.reduce((sum, r) => sum + (r.intensity || 3), 0);
            const avg = (total / records.length).toFixed(1);
            document.getElementById('avgWellbeing').textContent = avg + '/5';
        } else {
            document.getElementById('avgWellbeing').textContent = 'Sin datos';
        }

        if (records.length > 0) {
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
            document.getElementById('topEmotion').textContent = maxEmoji + ' (' + maxCount + ')';
        } else {
            document.getElementById('topEmotion').textContent = 'Sin datos';
        }

        const today = new Date().toISOString().split('T')[0];
        const todayRecords = records.filter(r => r.date === today);
        const uniqueTeachersToday = new Set(todayRecords.map(r => r.userId));
        const participation = filteredTeachers.length > 0
            ? Math.round((uniqueTeachersToday.size / filteredTeachers.length) * 100)
            : 0;
        document.getElementById('participationRate').textContent = participation + '%';
        document.getElementById('participationDetail').textContent =
            `${uniqueTeachersToday.size} de ${filteredTeachers.length} docentes`;

        const rateEl = document.getElementById('participationRate');
        if (participation >= 70) {
            rateEl.style.color = 'var(--primary-light)';
        } else if (participation >= 40) {
            rateEl.style.color = 'var(--accent-gold)';
        } else {
            rateEl.style.color = 'var(--secondary-warm)';
        }

        checkAlert(records);
    }

    // ===== ALERTA =====
    function checkAlert(records) {
        const total = records.length;
        if (total === 0) {
            if (alertBanner) alertBanner.style.display = 'none';
            return;
        }
        const negative = records.filter(r => r.emoji === '😢' || r.emoji === '😕').length;
        const negativePercentage = Math.round((negative / total) * 100);
        const threshold = 35;

        if (negativePercentage >= threshold) {
            if (alertBanner) alertBanner.style.display = 'flex';
            if (alertMessage) alertMessage.textContent = `Se ha detectado un ${negativePercentage}% de emociones negativas en el equipo. Se recomienda intervención.`;
        } else {
            if (alertBanner) alertBanner.style.display = 'none';
        }
    }

    // ===== CREAR O RECUPERAR CANVAS =====
    function getOrCreateCanvas(containerId) {
        let container = document.getElementById(containerId);
        if (!container) {
            const chartCard = document.querySelector('.chart-card');
            if (chartCard) {
                const newContainer = document.createElement('div');
                newContainer.id = containerId;
                newContainer.className = 'chart-container';
                const canvas = document.createElement('canvas');
                canvas.id = containerId.replace('Container', '');
                newContainer.appendChild(canvas);
                const oldContainer = chartCard.querySelector('.chart-container');
                if (oldContainer) oldContainer.replaceWith(newContainer);
                container = newContainer;
            } else {
                console.warn('Contenedor de gráfico no encontrado:', containerId);
                return null;
            }
        }
        let canvas = container.querySelector('canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = containerId.replace('Container', '');
            container.appendChild(canvas);
        }
        return canvas;
    }

    // ===== RENDERIZAR GRÁFICO SEMANAL =====
    function renderWeeklyChart(records) {
        const canvas = getOrCreateCanvas('weeklyChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        if (chartWeekly) {
            chartWeekly.destroy();
            chartWeekly = null;
        }

        const parent = canvas.parentElement;
        const emptyMsg = parent.querySelector('.empty-chart');
        if (emptyMsg) emptyMsg.remove();
        canvas.style.display = 'block';

        if (records.length === 0) {
            const msg = document.createElement('div');
            msg.className = 'empty-chart';
            msg.innerHTML = `
                <i class="ri-bar-chart-2-line"></i>
                <p>No hay datos suficientes para mostrar el gráfico.</p>
                <p class="text-help">Registra emociones para ver los datos.</p>
            `;
            parent.appendChild(msg);
            canvas.style.display = 'none';
            return;
        }

        const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
        const dayData = [0, 0, 0, 0, 0, 0, 0];
        const dayCounts = [0, 0, 0, 0, 0, 0, 0];

        records.forEach(r => {
            const date = new Date(r.timestamp);
            const day = date.getDay();
            const idx = day === 0 ? 6 : day - 1;
            dayData[idx] += (r.intensity || 3);
            dayCounts[idx] += 1;
        });

        const averages = dayData.map((sum, i) => dayCounts[i] > 0 ? (sum / dayCounts[i]) : null);
        const colors = averages.map(val => {
            if (val === null) return '#e5e7eb';
            if (val >= 4) return 'var(--primary-light)';
            if (val >= 3) return 'var(--accent-gold)';
            return 'var(--secondary-warm)';
        });

        chartWeekly = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: dayNames,
                datasets: [{
                    label: 'Promedio de bienestar',
                    data: averages,
                    backgroundColor: colors,
                    borderColor: colors.map(c => c === '#e5e7eb' ? '#d1d5db' : c),
                    borderWidth: 2,
                    borderRadius: 4,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const val = context.raw;
                                if (val === null) return 'Sin registros';
                                return `Bienestar: ${val.toFixed(1)}/5`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        min: 0,
                        max: 5,
                        ticks: { stepSize: 1 }
                    }
                }
            }
        });
    }

    // ===== RENDERIZAR GRÁFICO MENSUAL =====
    function renderMonthlyChart(records) {
        const canvas = getOrCreateCanvas('monthlyChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        if (chartMonthly) {
            chartMonthly.destroy();
            chartMonthly = null;
        }

        const parent = canvas.parentElement;
        const emptyMsg = parent.querySelector('.empty-chart');
        if (emptyMsg) emptyMsg.remove();
        canvas.style.display = 'block';

        if (records.length === 0) {
            const msg = document.createElement('div');
            msg.className = 'empty-chart';
            msg.innerHTML = `
                <i class="ri-bar-chart-2-line"></i>
                <p>No hay datos suficientes para mostrar el gráfico.</p>
                <p class="text-help">Registra emociones para ver los datos.</p>
            `;
            parent.appendChild(msg);
            canvas.style.display = 'none';
            return;
        }

        const now = new Date();
        const days = [];
        const dataPoints = [];

        for (let i = 29; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0];
            days.push(d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }));
            const dayRecords = records.filter(r => r.date === key);
            if (dayRecords.length > 0) {
                const avg = dayRecords.reduce((sum, r) => sum + (r.intensity || 3), 0) / dayRecords.length;
                dataPoints.push(avg);
            } else {
                dataPoints.push(null);
            }
        }

        const filledData = dataPoints.map((val, i) => {
            if (val !== null) return val;
            let prev = null, next = null;
            for (let j = i - 1; j >= 0; j--) {
                if (dataPoints[j] !== null) { prev = dataPoints[j]; break; }
            }
            for (let j = i + 1; j < dataPoints.length; j++) {
                if (dataPoints[j] !== null) { next = dataPoints[j]; break; }
            }
            if (prev !== null && next !== null) return (prev + next) / 2;
            if (prev !== null) return prev;
            if (next !== null) return next;
            return null;
        });

        chartMonthly = new Chart(ctx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [{
                    label: 'Bienestar diario',
                    data: filledData,
                    borderColor: 'var(--primary-dark)',
                    backgroundColor: 'rgba(44, 122, 123, 0.1)',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 3,
                    pointBackgroundColor: 'var(--primary-dark)',
                    spanGaps: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const val = context.raw;
                                if (val === null) return 'Sin registros';
                                return `Bienestar: ${val.toFixed(1)}/5`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        min: 0,
                        max: 5,
                        ticks: { stepSize: 1 }
                    },
                    x: {
                        ticks: {
                            maxTicksLimit: 10,
                            maxRotation: 45
                        }
                    }
                }
            }
        });
    }

    // ===== MAPA DE CALOR =====
    function renderHeatmap(records) {
        const container = document.getElementById('heatmapGrid');
        if (!container) return;

        const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        const emotions = ['😢', '😕', '😐', '🙂', '😄'];

        const matrix = {};
        days.forEach(d => {
            matrix[d] = {};
            emotions.forEach(e => matrix[d][e] = 0);
        });

        records.forEach(r => {
            const date = new Date(r.timestamp);
            const dayName = date.toLocaleDateString('es-ES', { weekday: 'long' });
            const emoji = r.emoji || '😐';
            if (matrix[dayName] && matrix[dayName][emoji] !== undefined) {
                matrix[dayName][emoji] += 1;
            }
        });

        let maxVal = 0;
        days.forEach(d => {
            emotions.forEach(e => {
                if (matrix[d][e] > maxVal) maxVal = matrix[d][e];
            });
        });

        let html = `
            <table class="heatmap-table">
                <thead>
                    <tr>
                        <th></th>
                        ${emotions.map(e => `<th>${e}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
        `;

        days.forEach(d => {
            html += `<tr><td class="heatmap-label">${d}</td>`;
            emotions.forEach(e => {
                const val = matrix[d][e] || 0;
                const intensity = maxVal > 0 ? val / maxVal : 0;
                const color = getHeatmapColor(intensity);
                html += `<td class="heatmap-cell" style="background:${color}; color:${intensity > 0.5 ? 'white' : '#333'};">
                    ${val > 0 ? val : ''}
                </td>`;
            });
            html += '</tr>';
        });

        html += `
                </tbody>
            </table>
            <div class="heatmap-legend">
                <span>Baja</span>
                <div class="legend-gradient"></div>
                <span>Alta</span>
            </div>
        `;

        container.innerHTML = html;
    }

    function getHeatmapColor(intensity) {
        const r1 = 135, g1 = 169, b1 = 135;
        const r2 = 255, g2 = 179, b2 = 67;
        const r3 = 217, g3 = 124, b3 = 96;

        let r, g, b;
        if (intensity < 0.5) {
            const t = intensity / 0.5;
            r = r1 + (r2 - r1) * t;
            g = g1 + (g2 - g1) * t;
            b = b1 + (b2 - b1) * t;
        } else {
            const t = (intensity - 0.5) / 0.5;
            r = r2 + (r3 - r2) * t;
            g = g2 + (g3 - g2) * t;
            b = b2 + (b3 - b2) * t;
        }
        return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    }

    // ===== NUBE DE PALABRAS =====
    function renderWordCloud(records) {
        const container = document.getElementById('wordCloudContainer');
        if (!container) return;

        const notes = records
            .filter(r => r.note && r.note.trim().length > 0)
            .map(r => r.note.toLowerCase());

        if (notes.length === 0) {
            container.innerHTML = `
                <div class="empty-wordcloud">
                    <i class="ri-chat-3-line"></i>
                    <p>No hay comentarios de docentes para analizar.</p>
                    <p class="text-help">Anima a tus docentes a escribir notas en sus registros.</p>
                </div>
            `;
            return;
        }

        const stopwords = ['de', 'la', 'que', 'el', 'en', 'y', 'a', 'los', 'del', 'las', 'un', 'por', 'con', 'no', 'su', 'para', 'es', 'al', 'lo', 'como', 'más', 'pero', 'sus', 'le', 'ya', 'este', 'entre', 'desde', 'todo', 'porque', 'si', 'mi', 'sin', 'sobre', 'también', 'me', 'hasta', 'hay', 'donde', 'quien', 'solo', 'esta', 'cuando', 'muy', 'así', 'para', 'se', 'lo', 'las'];

        const wordCount = {};
        notes.forEach(text => {
            const words = text.split(/[\s,.!?;:()]+/);
            words.forEach(word => {
                word = word.trim().replace(/[^a-zA-ZáéíóúñüÁÉÍÓÚÑÜ]/g, '');
                if (word.length < 3) return;
                if (stopwords.includes(word)) return;
                wordCount[word] = (wordCount[word] || 0) + 1;
            });
        });

        const sorted = Object.entries(wordCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 20);

        if (sorted.length === 0) {
            container.innerHTML = `
                <div class="empty-wordcloud">
                    <i class="ri-chat-3-line"></i>
                    <p>No hay suficientes palabras significativas.</p>
                </div>
            `;
            return;
        }

        const maxFreq = sorted[0][1];
        const minSize = 14;
        const maxSize = 36;

        container.innerHTML = sorted.map(([word, count]) => {
            const size = minSize + (count / maxFreq) * (maxSize - minSize);
            const colors = ['var(--primary-dark)', 'var(--primary-light)', 'var(--secondary-warm)', 'var(--accent-gold)', 'var(--text-dark)'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            return `<span class="wordcloud-word" style="font-size:${size}px; color:${color};" title="${count} menciones">${word}</span>`;
        }).join(' ');
    }

    // ===== ACTUALIZAR TODO =====
    function updateDashboard() {
        const filteredRecords = filterRecords();
        updateStats(filteredRecords);
        renderWeeklyChart(filteredRecords);
        renderMonthlyChart(filteredRecords);
        renderHeatmap(filteredRecords);
        renderWordCloud(filteredRecords);
    }

    // ===== FILTROS =====
    function setupFilters() {
        levelFilter.addEventListener('change', function() {
            currentFilters.level = this.value;
            updateDashboard();
        });

        deptFilter.addEventListener('change', function() {
            currentFilters.department = this.value;
            updateDashboard();
        });

        periodFilter.addEventListener('change', function() {
            currentFilters.period = this.value;
            updateDashboard();
        });
    }

    // ===== EXPORTAR PDF =====
    function exportPDF() {
        showToast('📄 Generando reporte PDF... (simulado)', 'info');
        setTimeout(() => {
            showToast('✅ Reporte PDF generado correctamente', 'success');
        }, 1500);
    }

    // ===== ACTUALIZAR DATOS =====
    function refreshData() {
        showToast('🔄 Actualizando datos...', 'info');
        setTimeout(() => {
            loadData();
            updateDashboard();
            showToast('✅ Datos actualizados correctamente', 'success');
        }, 500);
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

    // ===== INICIALIZAR =====
    function init() {
        if (typeof Chart === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
            script.onload = function() {
                doInit();
            };
            document.head.appendChild(script);
        } else {
            doInit();
        }
    }

    function doInit() {
        loadData();
        setupFilters();
        updateDashboard();

        if (exportPdfBtn) {
            exportPdfBtn.addEventListener('click', exportPDF);
        }
        if (refreshBtn) {
            refreshBtn.addEventListener('click', refreshData);
        }
        if (alertDetailsBtn) {
            alertDetailsBtn.addEventListener('click', function() {
                showToast('📋 Detalles de la alerta (simulado)', 'info');
            });
        }
    }

    // ===== EJECUCIÓN =====
    // Si la vista ya está cargada, inicializar
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        if (document.getElementById('levelFilter')) {
            init();
        }
    }

    // Escuchar viewLoaded
    document.addEventListener('viewLoaded', function(e) {
        if (e.detail.viewId === 'director-analytics') {
            init();
        }
    });

    // Fallback DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    }

})();