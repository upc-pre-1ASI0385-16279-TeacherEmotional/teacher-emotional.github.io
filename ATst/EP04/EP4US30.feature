Feature: Artículos cortos sobre manejo de ansiedad

  Como docente
  Deseo leer artículos breves con consejos psicológicos
  Para obtener herramientas teóricas que me ayuden a gestionar situaciones difíciles en el aula.

  Escenario: E01 - Lectura exitosa del artículo (flujo feliz)
    Dado que el docente ha iniciado sesión en "TeacherEmotional" y se encuentra en la sección de Recursos de Bienestar
    Cuando hace clic en el título de un artículo o en el botón "Leer más" de la lista
    Entonces el sistema despliega el texto completo en un formato de lectura cómoda
    Y la interfaz muestra el título, tiempo estimado de lectura, contenido con párrafos cortos, viñetas y un botón para retornar
    Y el diseño se adapta de forma responsiva tanto a dispositivos móviles como a pantallas de escritorio

  Escenario: E02 - Error al cargar el contenido del artículo (flujo alternativo)
    Dado que el docente se encuentra en la lista de artículos y hace clic en uno que no ha sido actualizado o fue eliminado de la base de datos
    Cuando ocurre un problema técnico, de conexión o el servidor no responde al cargar el contenido
    Entonces el sistema no despliega el texto y muestra el mensaje de error: "No se pudo cargar el artículo. Verifica tu conexión a internet o intenta más tarde."
    Y mantiene visible un botón para reintentar o volver a la lista sin perder su posición en la galería de recursos

  Examples: Datos de salida esperados
    | Elemento                     | Resultado esperado                                                                                       |
    | Lectura de artículo          | Se muestra el texto completo con formato legible, título, viñetas y tiempo estimado de lectura            |
    | Error de carga de contenido  | Muestra el mensaje de error: "No se pudo cargar el artículo. Verifica tu conexión a internet o intenta más tarde."|