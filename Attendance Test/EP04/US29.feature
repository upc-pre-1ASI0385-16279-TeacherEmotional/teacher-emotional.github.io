# US29.feature
# Epic: Biblioteca de Bienestar y Soporte Preventivo (EP04)

Feature: Galería de videos de pausas activas

  Como docente
  Deseo acceder a videos cortos de ejercicios físicos
  Para realizar estiramientos rápidos entre clases y reducir la tensión corporal

  Escenario: E01 - Visualización exitosa del video en ventana modal (flujo feliz)
  Dado que el docente ha iniciado sesión en TeacherEmotional
  Y entra a la sección de videos de la galería de pausas activas (EP04)
  Y se muestran miniaturas de rutinas como "Estiramiento de cuello", "Movilidad de hombros", "Pausa de piernas"
  Cuando selecciona una rutina de pausa activa (ej. hace clic en la tarjeta del video o en el botón "Ver rutina")
  Entonces el sistema muestra el video en una ventana modal (popup centrado con fondo semitransparente)
  Que incluye:
  - El reproductor de video con controles estándar (play, pausa, volumen, pantalla completa, barra de progreso)
  - El título de la rutina y su duración
  - Un botón de cierre (X) para salir de la modal
  Y el docente puede visualizar la técnica del ejercicio de forma fluida (sin recargas de página)
  Y al cerrar la modal, regresa a la galería de videos

  Escenario: E02 - Error al cargar el video (flujo alternativo)
  Dado que el docente se encuentra en la galería de videos
  Y selecciona una rutina de pausa activa
  Cuando el sistema intenta cargar el video pero ocurre un problema (ej. archivo no encontrado, formato no compatible con el navegador, fallo en la conexión a internet que impide el streaming o timeout del servidor)
  Entonces el sistema muestra un mensaje de error dentro de la ventana modal (o no abre la modal y muestra un toast/notificación)
  Y muestra el mensaje: "No se pudo cargar el video. Verifica tu conexión a internet o intenta más tarde."
  Y se ofrece un botón de "Reintentar" o "Volver a la galería" dentro del modal
  Y se cierra la modal si el usuario lo desea, sin afectar al resto de la aplicación

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Visualización exitosa        | Video en modal con controles estándar, título y duración, botón de cierre                            |
  | Error de carga               | Mensaje de error en modal o toast, opciones de reintentar o volver a la galería                      |