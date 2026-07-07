# US25.feature
# Epic: Visualización Analítica para la Toma de Decisiones (EP03)

Feature: Exportación a Excel de datos crudos

  Como directivo
  Deseo descargar los datos en formato CSV o Excel
  Para realizar análisis estadísticos avanzados de forma externa

  Escenario: E01 - Exportación exitosa de datos crudos anonimizados (flujo feliz)
  Dado que el directivo ha iniciado sesión en TeacherEmotional
  Y tiene permisos de exportación (rol directivo o administrador)
  Y ha aplicado los filtros deseados (rango de fechas, nivel educativo, departamento, etc.)
  Cuando solicita la descarga de datos crudos mediante el botón "Exportar a Excel/CSV" en la sección de reportes
  Entonces el sistema genera un archivo de hoja de cálculo (formato .xlsx o .csv)
  Que contiene los registros emocionales anonimizados con las columnas:
  - Fecha y hora del registro
  - Tipo de registro (Inicio / Fin de jornada)
  - Emoción seleccionada (texto o valor numérico 1-5)
  - Intensidad (1-5)
  - Etiquetas de causa de estrés (si aplica)
  - Comentario opcional (anonimizado, sin identificar al docente)
  - Nivel educativo (agregado)
  - Departamento académico
  Y el archivo no incluye nombres, correos ni identificadores personales
  Y se muestra un mensaje de éxito: "Archivo exportado correctamente."

  Escenario: E02 - Intento de exportación sin permisos o sin datos (flujo alternativo)
  Dado que un usuario sin permisos de exportación (ej. docente o coordinador) intenta acceder a la función
  O el directivo solicita la exportación pero no hay registros en el período seleccionado
  Cuando presiona el botón de exportación
  Entonces el sistema no genera el archivo
  Y muestra un mensaje según el caso:
  - Sin permisos: "No tienes autorización para exportar datos crudos. Contacta a un administrador."
  - Sin datos: "No hay registros en el período seleccionado. No se puede generar la exportación."
  Y el botón se mantiene visible pero deshabilitado (en caso de sin datos) o se oculta para roles sin permisos
  Y el usuario permanece en la misma pantalla

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Exportación exitosa          | Archivo .xlsx o .csv con datos anonimizados, mensaje de éxito                                        |
  | Sin permisos                 | Mensaje de error por falta de autorización                                                            |
  | Sin datos                    | Mensaje de error, botón deshabilitado                                                                 |