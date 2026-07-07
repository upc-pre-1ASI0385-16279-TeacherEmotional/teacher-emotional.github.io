# US06.feature
# Epic: Gestión de Seguridad y Perfiles de Usuario (EP01)

Feature: Verificación de cuenta vía correo

  Como usuario recién registrado
  Deseo verificar mi dirección de correo electrónico
  Para confirmar mi identidad y activar todas las funciones de la plataforma

  Escenario: E01 - Verificación exitosa de cuenta (enlace válido)
  Dado que el usuario ha completado el registro en TeacherEmotional pero su cuenta aún tiene el estado "No verificada"
  Y ha recibido un correo automático con un enlace de activación
  Cuando hace clic en el enlace de verificación enviado a su bandeja de entrada (dentro del período de validez, ej. 24 horas)
  Entonces el sistema cambia el estado de la cuenta a "Verificada"
  Y muestra una pantalla de confirmación con el mensaje "¡Correo verificado con éxito! Ya puedes acceder a todas las funciones de la plataforma"
  Y redirige automáticamente al usuario a la página de inicio de sesión (login)
  O si ya tenía una sesión activa limitada, le otorga acceso completo según su rol

  Escenario: E02 - Enlace expirado o inválido (flujo alternativo)
  Dado que el usuario ha recibido un correo de verificación pero el enlace ha expirado (ej. después de 24 horas) o ha sido modificado/manipulado
  Cuando hace clic en el enlace de verificación
  Entonces el sistema muestra una pantalla de error con el mensaje: "El enlace de verificación ha expirado o es inválido. Solicita un nuevo correo de activación."
  Y proporciona un botón o enlace visible para "Reenviar correo de verificación"
  Cuando el usuario presiona el botón "Reenviar correo de verificación"
  Entonces el sistema genera y envía un nuevo enlace válido al correo del usuario sin necesidad de volver a registrar todos los datos

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Enlace válido                | Cambia estado a "Verificada", muestra mensaje de éxito y redirige a login                            |
  | Enlace expirado o inválido   | Muestra mensaje de error y ofrece opción para reenviar correo                                        |
  | Reenvío de correo            | Genera un nuevo enlace válido y lo envía al correo del usuario                                       |