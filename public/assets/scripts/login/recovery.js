// recovery.js - Lógica de recuperación de contraseña

function showMessage(message, isError = true) {
    const msgDiv = document.getElementById('authMessage');
    if (msgDiv) {
        msgDiv.textContent = message;
        msgDiv.className = `auth-message ${isError ? 'error' : 'success'}`;
        msgDiv.style.display = 'block';
        setTimeout(() => {
            msgDiv.style.display = 'none';
        }, 5000);
    }
}

document.getElementById('recoveryForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('recoveryEmail').value.trim();

    if (!email) {
        showMessage('Por favor ingresa tu correo electrónico', true);
        return;
    }

    // Simular envío de correo
    showMessage(`Se ha enviado un enlace de recuperación a ${email} (simulado)`, false);

    // Limpiar campo
    document.getElementById('recoveryEmail').value = '';
});