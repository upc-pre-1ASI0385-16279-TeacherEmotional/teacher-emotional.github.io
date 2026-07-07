# US28.feature
# Epic: Biblioteca de Bienestar y Soporte Preventivo (EP04)

Feature: Reproductor de audio para meditaciones guiadas

  Como docente
  Deseo escuchar audios de meditación dentro de la plataforma
  Para practicar ejercicios de mindfulness durante mis tiempos libres en el colegio

  Escenario: E01 - Reproducción exitosa del audio de meditación (flujo feliz)
  Dado que el docente ha iniciado sesión en TeacherEmotional
  Y se encuentra en la sección de Recursos de Bienestar (EP04)
  Y se muestran varios audios de meditaciones guiadas (ej. "Respiración consciente", "Relajación de 5 minutos")
  Cuando selecciona un recurso de audio (ej. hace clic en la tarjeta del audio o en el botón "Reproducir")
  Y presiona el botón de "Play" en el reproductor integrado
  Entonces el sistema activa un reproductor de audio dentro de la misma página (no abre otra pestaña)
  Que permite:
  - Reproducir el audio (con barra de progreso y tiempo transcurrido)
  - Pausar y reanudar la reproducción
  - Controlar el volumen (slider o botones +/-)
  - Ver la duración total del audio
  Y el docente puede seguir navegando por otras secciones de la app (o minimizar el reproductor)
  Mientras el audio continúa reproduciéndose en segundo plano

  Escenario: E02 - Error de reproducción (flujo alternativo - fallo técnico)
  Dado que el docente ha seleccionado un recurso de audio
  Y presiona el botón "Play"
  Cuando ocurre un problema que impide la reproducción (ej. archivo de audio no disponible en el servidor, formato no soportado por el navegador, fallo en la conexión a internet que interrumpe el streaming)
  Entonces el sistema no inicia la reproducción
  Y muestra un mensaje de error claro dentro del reproductor: "No se pudo reproducir el audio. Verifica tu conexión a internet o intenta más tarde."
  Y el reproductor permanece visible pero deshabilitado (o con el botón "Play" habilitado para reintentar)
  Y se ofrece un botón de "Reportar problema" o "Recargar audio" para notificar al soporte o reintentar la carga del archivo

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Reproducción exitosa         | Reproductor con controles (play/pausa, volumen, barra de progreso), audio en segundo plano           |
  | Error de reproducción        | Mensaje de error claro, reproductor visible, opción de reintentar o reportar                          |