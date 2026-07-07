# US03.feature
# Epic: Gestión de Seguridad y Perfiles de Usuario (EP01)

Feature: Cierre de sesión seguro

  Como usuario activo
  Deseo cerrar mi sesión de forma voluntaria
  Para garantizar que nadie más pueda acceda a mi información en un dispositivo compartido

  Escenario: E01 - Cierre de sesión exitoso
  Dado que el usuario ha iniciado sesión en TeacherEmotional y se encuentra en cualquier sección de la aplicación
  Cuando hace clic en el botón "Cerrar Sesión" ubicado en el menú de usuario o en la barra de navegación
  Entonces el sistema destruye inmediatamente el token de acceso y toda la sesión activa en el servidor y en el cliente (localStorage/sessionStorage)
  Y redirige al usuario a la página de inicio de sesión o bienvenida de la aplicación
  Y muestra un mensaje: "Has cerrado sesión correctamente."

  Escenario: E02 - Confirmación opcional antes de cerrar sesión (Buena práctica de UX)
  Dado que el usuario ha iniciado sesión y se encuentra dentro de la aplicación
  Cuando hace clic en el botón "Cerrar Sesión"
  Entonces el sistema muestra un diálogo de confirmación con el mensaje: "¿Estás seguro de que deseas cerrar sesión?" y dos opciones: "Sí, cerrar sesión" y "Cancelar"
  Y si el usuario selecciona "Sí, cerrar sesión", se ejecuta el flujo del Escenario 1 (destruye token y redirige)
  Y si selecciona "Cancelar", el diálogo se cierra y el usuario permanece en la misma página sin interrumpir su actividad

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Cierre exitoso               | Redirige a login.html y muestra mensaje de confirmación (toast o alerta)                              |
  | Confirmación "Sí"            | Se ejecuta el cierre de sesión                                                                       |
  | Confirmación "Cancelar"      | El diálogo se cierra y el usuario continúa en la misma página                                        |