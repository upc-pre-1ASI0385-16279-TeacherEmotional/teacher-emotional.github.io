# US24.feature
# Epic: Visualización Analítica para la Toma de Decisiones (EP03)

Feature: Exportación a PDF de reportes

  Como directivo
  Deseo exportar la vista actual del dashboard en formato PDF
  Para presentar los resultados de bienestar en las reuniones de consejo directivo

  Escenario: E01 - Exportación exitosa del dashboard actual (flujo feliz)
  Dado que el directivo ha iniciado sesión en TeacherEmotional
  Y ha aplicado los filtros deseados (nivel educativo, departamento, rango de fechas)
  Y ha configurado la vista de datos específica que desea exportar (ej. gráfico de barras semanal con filtro de secundaria)
  Cuando presiona el botón "Descargar PDF" ubicado en la sección de reportes del dashboard
  Entonces el sistema genera un documento estático en formato PDF que incluye:
  - Todos los gráficos visibles en pantalla (con la misma escala y colores)
  - Los resúmenes y métricas clave (promedios, porcentajes)
  - Un encabezado con el nombre de la institución, el título "Reporte de Bienestar Docente - TeacherEmotional", la fecha y hora de generación, y los filtros aplicados
  Y el PDF se descarga automáticamente al dispositivo del usuario o se abre en una nueva pestaña para guardarlo
  Y se muestra un mensaje de éxito: "Reporte exportado correctamente."

  Escenario: E02 - Error durante la generación del PDF (flujo alternativo)
  Dado que el directivo ha presionado el botón "Descargar PDF"
  Cuando ocurre un problema técnico durante la generación del documento (ej. error en la librería de gráficos, el servidor no responde, el tamaño de datos es excesivo o hay problemas de memoria en el cliente)
  Entonces el sistema no genera el archivo PDF
  Y muestra un mensaje de error claro: "No se pudo generar el PDF. Por favor, intenta de nuevo más tarde. Si el problema persiste, contacta con soporte."
  Y el botón "Descargar PDF" se vuelve a habilitar después de unos segundos (o muestra un indicador de carga fallido)
  Y el usuario permanece en el dashboard sin perder los filtros aplicados

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Exportación exitosa          | PDF generado con gráficos, métricas y encabezado, se descarga automáticamente, mensaje de éxito      |
  | Error en generación          | Mensaje de error claro, botón se habilita nuevamente, filtros se mantienen                           |