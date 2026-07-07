# US30.feature
# Epic: Biblioteca de Bienestar y Soporte Preventivo (EP04)

Feature: Artículos cortos sobre manejo de ansiedad

  Como docente
  Deseo leer artículos breves con consejos psicológicos
  Para obtener herramientas teóricas que me ayuden a gestionar situaciones difíciles en el aula

  Escenario: E01 - Lectura exitosa del artículo (flujo feliz)
  Dado que el docente ha iniciado sesión en TeacherEmotional
  Y se encuentra en la sección de Recursos de Bienestar (EP04)
  Y se muestra una lista de artículos cortos sobre manejo de ansiedad (ej. "5 técnicas para calmar la ansiedad antes de clase", "Cómo responder ante una situación conflictiva en el aula")
  Cuando hace clic en el título del artículo o en el botón "Leer más"
  Entonces el sistema despliega el texto completo del artículo en un formato de lectura cómoda
  Que incluye:
  - Título del artículo
  - Tiempo estimado de lectura (ej. "Lectura de 3 minutos")
  - Contenido con párrafos cortos, viñetas y negritas para facilitar la lectura
  - Imagen ilustrativa (opcional, pero optimizada para carga rápida)
  - Botón de "Cerrar" o "Volver a la lista" (puede ser una vista modal o una página aparte con navegación de retorno)
  Y el diseño es responsivo, adaptándose correctamente tanto a dispositivos móviles (tamaño de texto legible, sin necesidad de zoom horizontal) como a escritorio (ancho de columna adecuado, márgenes cómodos)

  Escenario: E02 - Error al cargar el contenido del artículo (flujo alternativo)
  Dado que el docente se encuentra en la lista de artículos
  Y hace clic en el título de uno
  Cuando ocurre un problema técnico al cargar el contenido (ej. el servidor no responde, el artículo no existe en la base de datos, fallo de conexión a internet)
  Entonces el sistema no despliega el texto
  Y muestra un mensaje de error claro: "No se pudo cargar el artículo. Verifica tu conexión a internet o intenta más tarde."
  Y se mantiene visible un botón para "Reintentar" o "Volver a la lista de artículos"
  Y el usuario no pierde su posición en la galería de recursos

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Lectura exitosa              | Artículo en formato de lectura con título, tiempo estimado, contenido, botón de cierre               |
  | Error de carga               | Mensaje de error claro, botones para reintentar o volver a la lista                                  |