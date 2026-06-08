const resources = [
    { id: "r1", type: "audio", title: "Respiración consciente", description: "Meditación guiada de 5 min" },
    { id: "r2", type: "video", title: "Estiramiento de cuello", description: "Pausa activa de 3 min" },
    { id: "r3", type: "article", title: "Manejo del estrés en el aula", description: "Consejos prácticos" }
];
function renderGuides() {
    const grid = document.getElementById('guidesGrid');
    if (!grid) return;
    grid.innerHTML = resources.map(r => `<div class="guide-card"><h3>${r.title}</h3><p>${r.description}</p><button class="btn-outline">Ver</button></div>`).join('');
}
document.addEventListener('DOMContentLoaded', renderGuides);