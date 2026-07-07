# US36.feature
# Epic: Gestión de Estructura Institucional (EP05)

Feature: Creación manual de usuario docente

  Como administrador
  Deseo registrar a un docente de forma individual
  Para darle acceso a la plataforma cuando se incorpora un nuevo trabajador a la institución

  Escenario: E01 - Creación exitosa de docente individual (flujo feliz)
  Dado que el administrador (directivo o coordinador con privilegios) ha iniciado sesión en TeacherEmotional
  Y se encuentra en el módulo de "Gestión de Usuarios" (EP05)
  Cuando completa el formulario con los datos del nuevo docente: nombre completo, correo electrónico institucional y DNI (además de campos opcionales como nivel educativo y departamento)
  Y presiona el botón "Crear"
  Entonces el sistema guarda al nuevo usuario en la base de datos con rol "docente"
  Y le asigna una contraseña temporal segura (ej. generada automáticamente)
  Y envía automáticamente un correo electrónico al docente con sus credenciales de acceso (correo + contraseña temporal) y un enlace para iniciar sesión y cambiar su contraseña
  Y se muestra un mensaje de éxito al administrador: "Docente registrado correctamente. Se han enviado las credenciales a su correo."

  Escenario: E02 - Intento de crear docente con correo duplicado o datos inválidos (flujo alternativo)
  Dado que el administrador se encuentra en el módulo de "Gestión de Usuarios" completando el formulario de creación
  Cuando ingresa un correo electrónico que ya está registrado en la plataforma (como docente, coordinador o directivo de la misma institución)
  O deja campos obligatorios vacíos (ej. nombre, correo o DNI)
  O el DNI tiene un formato inválido
  Entonces el sistema no crea el nuevo usuario
  Y muestra un mensaje de error específico:
  - "El correo ya está registrado en la institución. Verifica los datos."
  - "Completa todos los campos obligatorios."
  - "Formato de DNI inválido (debe tener 8 dígitos)."
  Y el formulario conserva los datos ya ingresados para que el administrador los corrija
  Y el botón "Crear" permanece deshabilitado hasta que todos los campos sean válidos y el correo no esté duplicado

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Creación exitosa             | Usuario guardado con rol docente, contraseña temporal generada, correo enviado, mensaje de éxito     |
  | Correo duplicado             | Mensaje de error específico, formulario conserva datos, botón deshabilitado                           |
  | Campos obligatorios vacíos   | Mensaje de error, formulario conserva datos, botón deshabilitado                                      |
  | DNI inválido                 | Mensaje de error específico, formulario conserva datos, botón deshabilitado                          |