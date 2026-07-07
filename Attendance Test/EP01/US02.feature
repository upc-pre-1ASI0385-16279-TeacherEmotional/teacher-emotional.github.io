# US02.feature
# Epic: Gestión de Seguridad y Perfiles de Usuario (EP01)

Feature: Recuperación de contraseña por email

  Como usuario de la plataforma
  Deseo solicitar el restablecimiento de mi contraseña
  Para recuperar el acceso a mi cuenta en caso de haberla olvidado

  Escenario: E01 - Solicitud exitosa de recuperación
  Dado que el usuario se encuentra en la vista de "Recuperar Contraseña" de TeacherEmotional
  Cuando ingresa su correo electrónico registrado en la plataforma
  Y presiona el botón "Enviar enlace"
  Entonces el sistema verifica que el correo existe
  Y genera un token único y seguro (con expiración de 1 hora)
  Y envía automáticamente un mensaje al buzón del usuario con un enlace de restablecimiento
  Y muestra en pantalla un mensaje de confirmación: "Revisa tu correo. Te hemos enviado un enlace para recuperar tu contraseña."

  Escenario: E02 - Correo no registrado (Flujo de seguridad)
  Dado que el usuario se encuentra en la vista de "Recuperar Contraseña"
  Cuando ingresa un correo electrónico que no está registrado en la plataforma
  Y presiona el botón "Enviar enlace"
  Entonces el sistema muestra un mensaje de error genérico por seguridad: "Si el correo está registrado, recibirás un enlace de recuperación."
  Y no se envía ningún correo electrónico
  Y el usuario permanece en la misma vista sin acceder a información sensible

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Correo registrado            | Muestra mensaje de éxito: "Revisa tu correo..." y envía enlace de restablecimiento (simulado)       |
  | Correo no registrado         | Muestra mensaje genérico: "Si el correo está registrado, recibirás un enlace de recuperación."       |
  | Permanencia en pantalla      | El usuario sigue en la vista de recuperación sin avanzar a otra sección                              |