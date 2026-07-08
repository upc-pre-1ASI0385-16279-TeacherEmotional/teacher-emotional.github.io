# TeacherEmotional

**Plataforma de bienestar emocional para docentes y directivos**

TeacherEmotional es una aplicación web que permite a los docentes registrar su estado emocional diario, acceder a recursos de autocuidado y participar en una comunidad de apoyo. Los directivos pueden visualizar analíticas agregadas, gestionar usuarios y configurar alertas tempranas para mejorar el clima laboral.

---

## 🚀 Características principales

- **Registro emocional** con emojis, intensidad, notas y etiquetas de estrés.
- **Historial personal** con gráficos de evolución y estadísticas.
- **Biblioteca de bienestar** con meditaciones, pausas activas y artículos.
- **Comunidad** para compartir experiencias y consejos.
- **Panel de analítica** para directivos (gráficos, mapa de calor, nube de palabras).
- **Gestión de usuarios** (CRUD de docentes, asignación de departamentos).
- **Sistema de alertas** con umbral configurable y simulador SOS.
- **Modo offline** (datos sincronizados en localStorage).

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Uso |
|------------|-----|
| HTML5, CSS3 | Estructura y estilos |
| JavaScript  | Lógica de negocio |
| Chart.js | Gráficos interactivos |
| Remixicon | Iconografía |
| LocalStorage | Persistencia de datos (simulación de base de datos) |

---

## 📁 Estructura del proyecto

```
TeacherEmotional/
├── public/
│   ├── assets/
│   │   ├── scripts/      # Lógica por vista y rol
│   │   ├── styles/       # CSS organizado por sección
│   │   └── images/       # Imágenes del landing y equipo
│   └── views/            # HTML de las vistas del dashboard
├── ATst/                 # Pruebas de aceptación (Gherkin)
├── dashboard.html         # Contenedor del dashboard
├── index.html             # Landing page
├── login.html             # Página de inicio de sesión
├── register.html          # Registro de nuevos usuarios
├── recovery.html          # Recuperación de contraseña
└── README.md
```
---

## 🧪 Cómo probar el proyecto

1. **Clona el repositorio** o descarga los archivos.
2. Abre el proyecto en un servidor local (recomendado: **Live Server** en VS Code).
3. Accede a `index.html` para ver la landing page.
4. Haz clic en "Iniciar sesión" y usa las credenciales de prueba:

   | Rol | Correo | Contraseña |
   |-----|--------|------------|
   | Docente | `docente@demo.com` | `123456` |
   | Directivo | `directivo@demo.com` | `123456` |

5. Explora el dashboard según tu rol.

---

## 📝 Credenciales de prueba

Si prefieres registrarte, puedes crear una cuenta desde `register.html` (elige rol docente o directivo).

---

## 🧑‍💻 Equipo

| Integrante | Rol |
|------------|-----|
| Luis Alonso Huaco Oliva | Product Owner & Scrum Master |
| Terry Jeremy Chavez Chuquimbalqui | Desarrollador Frontend |
| Maria Rosa Chang Vasquez | Desarrolladora Frontend |
| Adrian Eduardo Estrada Ochoa | UX/UI Designer |
| Miguel Hiroomi Urbiola Gomero | QA & Documentación |

---

## 📄 Licencia

Proyecto desarrollado con fines académicos para el curso de IHC y Tecnologías Móviles - UPC 2026.

---

## 📬 Contacto

Para consultas o sugerencias: `perghormaru@gmail.com`