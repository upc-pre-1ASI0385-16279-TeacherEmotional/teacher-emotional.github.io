// register.js - Lógica de registro

function registerUser(userData) {
  const stored = localStorage.getItem("teacherEmotionalData");
  let data = stored
    ? JSON.parse(stored)
    : { users: [], emotionalRecords: [], favoriteResources: {}, auditLog: [] };

  if (data.users.find((u) => u.email === userData.email)) {
    return { success: false, message: "El correo ya está registrado" };
  }

  const newUser = {
    id: Date.now() + "-" + Math.random().toString(36).substr(2, 6),
    name: `${userData.name} ${userData.lastname}`,
    email: userData.email,
    password: userData.password,
    role: userData.role,
    active: true,
    verified: false,
    level: userData.role === "teacher" ? "Secundaria" : null,
    department: null,
  };

  data.users.push(newUser);

  // Si es director, actualizar institución
  if (userData.role === "director" && userData.institution) {
    data.institution = data.institution || {
      name: userData.institution,
      logo: "https://i.imgur.com/32rW4mJ.png",
      levels: ["Inicial", "Primaria", "Secundaria"],
      departments: ["Matemáticas", "Comunicación", "Ciencias"],
    };
  }

  localStorage.setItem("teacherEmotionalData", JSON.stringify(data));
  return {
    success: true,
    message: "Cuenta creada. Ahora puedes iniciar sesión",
  };
}

function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function showMessage(message, isError = true) {
  const msgDiv = document.getElementById("authMessage");
  if (msgDiv) {
    msgDiv.textContent = message;
    msgDiv.className = `auth-message ${isError ? "error" : "success"}`;
    msgDiv.style.display = "block";
    setTimeout(() => {
      msgDiv.style.display = "none";
    }, 5000);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const regRole = document.getElementById("regRole");
  const institutionField = document.getElementById("institutionField");

  regRole.addEventListener("change", () => {
    institutionField.style.display =
      regRole.value === "director" ? "block" : "none";
  });

  document.getElementById("registerForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const password = document.getElementById("regPassword").value;
    const confirmPassword = document.getElementById("regConfirmPassword").value;

    if (password !== confirmPassword) {
      showMessage("Las contraseñas no coinciden", true);
      return;
    }

    const userData = {
      name: document.getElementById("regName").value,
      lastname: document.getElementById("regLastname").value,
      email: document.getElementById("regEmail").value,
      password: password,
      role: document.getElementById("regRole").value,
      institution: document.getElementById("regInstitution")?.value || "",
    };

    const result = registerUser(userData);
    if (result.success) {
      showMessage(result.message, false);
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    } else {
      showMessage(result.message, true);
    }
  });

  // Mostrar/ocultar contraseña
  document.querySelectorAll(".toggle-password").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = btn.previousElementSibling;
      if (input && input.type) {
        input.type = input.type === "password" ? "text" : "password";
        const icon = btn.querySelector("i");
        if (icon) {
          icon.classList.toggle("ri-eye-line");
          icon.classList.toggle("ri-eye-off-line");
        }
      }
    });
  });
});
