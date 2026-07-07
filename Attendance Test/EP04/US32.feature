# US32.feature
# Epic: Biblioteca de Bienestar y Soporte Preventivo (EP04)

Feature: Filtro por tipo de recurso (Audio, Video, Texto)

  Como docente
  Deseo filtrar el contenido por formato
  Para consumir el material que mejor se adapte a mis posibilidades técnicas o de tiempo en ese momento

  Escenario: E01 - Filtrado exitoso por un tipo de recurso (flujo feliz)
  Dado que el docente ha iniciado sesión en TeacherEmotional
  Y se encuentra en la galería de bienestar (biblioteca de recursos que incluye audios, videos y artículos/textos)
  Cuando selecciona una categoría de formato en el menú de filtros, por ejemplo "Solo videos" (puede ser mediante botones tipo pestaña: "Todos", "Audios", "Videos", "Artículos")
  Entonces la interfaz oculta los demás formatos (audios y artículos)
  Y organiza los recursos solicitados (solo videos) en una cuadrícula limpia, mostrando únicamente las tarjetas o elementos de ese tipo
  Y se indica visualmente qué filtro está activo (ej. el botón "Videos" con color de fondo diferente o subrayado)
  Y se muestra el número de resultados encontrados (ej. "4 videos disponibles")

  Escenario: E02 - Cambio de filtro o selección de "Todos" (flujo alternativo)
  Dado que el docente se encuentra en la galería de bienestar con un filtro activo (ej. "Solo audios")
  Cuando selecciona una categoría diferente (ej. cambia a "Artículos") O selecciona la opción "Todos" para eliminar cualquier filtro
  Entonces el sistema actualiza inmediatamente la cuadrícula mostrando:
  - Si cambió a "Artículos": solo los textos/artículos
  - Si seleccionó "Todos": todos los recursos disponibles (audios, videos y artículos) sin ningún filtro de formato
  Y se actualiza el indicador del filtro activo y el contador de resultados (ej. "Mostrando todos los recursos: 12")
  Y la interfaz se mantiene responsive y limpia

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Filtro por tipo              | Muestra solo recursos del tipo seleccionado, indicador visual activo, contador de resultados         |
  | Cambio de filtro             | Actualiza la cuadrícula según la nueva selección, actualiza el contador                              |
  | Selección de "Todos"         | Muestra todos los recursos sin filtro, contador total                                                |