# US42.feature
# Epic: Gestión de Estructura Institucional (EP05)

Feature: Cambio masivo de contraseñas por seguridad

  Como administrador
  Deseo forzar el restablecimiento de contraseñas de un grupo de usuarios
  Para cumplir con protocolos de seguridad periódicos de la institución

  Escenario: E01 - Reseteo masivo exitoso de contraseñas (flujo feliz)
  Dado que el administrador ha iniciado sesión en TeacherEmotional
  Y se encuentra en el módulo de "Gestión de Usuarios" (EP05)
  Y ha seleccionado varios usuarios de la lista (ej. 10 docentes) mediante checkboxes o selección múltiple
  Cuando presiona la opción "Resetear contraseñas" (ubicada en un menú de acciones masivas)
  Y confirma la acción en un diálogo emergente: "¿Estás seguro de que deseas restablecer las contraseñas de X usuarios? Se invalidarán sus claves actuales y recibirán instrucciones por correo."
  Entonces el sistema invalida las claves actuales de todos los usuarios seleccionados
  Y genera nuevas contraseñas temporales seguras
  Y envía correos electrónicos individuales a cada usuario con instrucciones para crear una nueva clave (enlace único o código temporal)
  Y se muestra un reporte de éxito al administrador: "Se restablecieron las contraseñas de X usuarios. Se han enviado los correos con instrucciones." (ej. 10 exitosos, 0 errores)

  Escenario: E02 - Selección vacía o error en el proceso masivo (flujo alternativo)
  Dado que el administrador se encuentra en la lista de usuarios
  Cuando presiona la opción "Resetear contraseñas" sin haber seleccionado ningún usuario (lista vacía)
  O ocurre un error técnico durante el proceso (ej. fallo en el servidor al generar las nuevas claves, problemas con el servicio de correo que impiden enviar algunos emails)
  Entonces el sistema no ejecuta el reseteo
  Y muestra un mensaje según el caso:
  - Sin selección: "No has seleccionado ningún usuario. Marca al menos un usuario para restablecer su contraseña."
  - Error técnico: "Ocurrió un error al intentar restablecer las contraseñas. Algunos usuarios pudieron no recibir el correo. Por favor, revisa los logs o intenta de nuevo más tarde."
  Y si hubo error parcial (ej. 8 de 10 correos enviados correctamente), se muestra un reporte detallado con los usuarios fallidos
  Y el administrador puede reintentar solo con ellos

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Reseteo exitoso              | Claves invalidadas, nuevas contraseñas temporales generadas, correos enviados, mensaje de éxito       |
  | Selección vacía              | Mensaje de error: "No has seleccionado ningún usuario..."                                             |
  | Error técnico completo       | Mensaje de error: "Ocurrió un error al intentar restablecer las contraseñas..."                       |
  | Error parcial                | Reporte detallado con usuarios fallidos, posibilidad de reintentar                                    |