Feature: Registro de nuevo directivo

  Como director de una institución educativa 
  Deseo registrar mi cuenta administrativa
  Para comenzar a gestionar el bienestar docente de mi centro escolar.

  Escenario: E01 - Registro exitoso de directivo
    Dado que el directivo se encuentra en el formulario de registro institucional de "TeacherEmotional"
    Cuando completa todos los datos personales requeridos (nombre completo, correo electrónico institucional, teléfono, cargo)
    Y completa los datos de la institución (nombre del colegio, nivel educativo, dirección, RUC opcional)
    Y acepta los términos y condiciones junto a la política de privacidad
    Y presiona el botón "Registrarme"
    Entonces el sistema valida que el correo no esté previamente registrado y crea la cuenta con privilegios de administrador (rol: directivo)
    Y envía un correo de verificación a la cuenta del usuario
    Y redirige al usuario a la interfaz de configuración inicial mostrando el mensaje de bienvenida: "¡Cuenta creada con éxito! Ahora configura tu institución."

  Escenario: E02 - Correo ya registrado o datos inválidos
    Dado que el directivo se encuentra en el formulario de registro institucional
    Cuando ingresa un correo electrónico que ya está registrado en la plataforma o deja campos obligatorios vacíos
    Entonces el sistema no crea la cuenta y muestra un mensaje de error específico según el caso
    Y el formulario conserva los datos ya ingresados para que el usuario los corrija
    Y el botón de registro permanece deshabilitado hasta que todos los campos sean válidos

  Examples: Datos de salida esperados
    | Elemento                     | Resultado esperado                                                                                       |
    | Registro exitoso             | Se envía correo de verificación y redirige al usuario a la interfaz de configuración inicial             |
    | Correo duplicado             | Muestra el mensaje: "Este correo electrónico ya está registrado. ¿Deseas iniciar sesión?" con link a login|
    | Campos incompletos           | Muestra el mensaje: "Completa todos los campos obligatorios antes de continuar"                         |