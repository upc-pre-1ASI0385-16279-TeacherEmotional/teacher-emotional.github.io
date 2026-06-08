// Funciones para el muro comunitario
function publishPost() {
    const content = document.getElementById('postContent').value;
    if (!content.trim()) return;
    showToast("Publicación simulada: " + content.substring(0,50), "success");
    document.getElementById('postContent').value = '';
    document.getElementById('publishBtn').disabled = true;
}
document.getElementById('postContent')?.addEventListener('input', function() {
    document.getElementById('publishBtn').disabled = this.value.trim().length === 0;
    document.getElementById('charCount').innerText = this.value.length;
});
function loadMorePosts() { showToast("Cargar más publicaciones (simulado)", "info"); }
function addTag(type) { showToast(`Etiqueta ${type} añadida`, "info"); }