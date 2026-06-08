// Mostrar historial emocional del usuario actual
const user = JSON.parse(localStorage.getItem('teacherEmotionalData'))?.currentUser;
if (user) {
    document.getElementById('user-name').innerText = user.name;
    // etc.
}