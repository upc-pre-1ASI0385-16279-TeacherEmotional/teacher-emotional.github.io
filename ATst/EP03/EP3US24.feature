Feature: Exportación a PDF de reportes

  Como directivo
  Deseo exportar la vista actual del dashboard en formato PDF
  Para presentar los resultados de bienestar en las reuniones de consejo directivo.

  Escenario: E01 - Exportación exitosa del dashboard actual (flujo feliz)
    Dado que el directivo ha iniciado sesión en "TeacherEmotional" y ha aplicado los filtros deseados
    Y ha configurado la vista de datos específica que desea exportar
    Cuando presiona el botón "Descargar PDF" ubicado en la sección de reportes del dashboard
    Entonces el sistema genera un documento estático en formato PDF con gráficos visibles, resúmenes, métricas, fecha, hora y filtros aplicados
    Y el archivo PDF se descarga automáticamente en el dispositivo del usuario
    Y el sistema muestra el mensaje de éxito: "Reporte exportado correctamente."

  Escenario: E02 - Error durante la generación del PDF (flujo alternativo)
    Dado que el directivo ha presionado el botón "Descargar PDF" tras aplicar filtros erróneos o por un fallo técnico
    Cuando ocurre un problema durante la generación del documento o el servidor no responde
    Entonces el sistema no genera el archivo PDF y muestra un indicador de carga fallido
    Y despliega el mensaje de error: "No se pudo generar el PDF. Por favor, intenta de nuevo más tarde. Si el problema persiste, contacta con soporte."
    Y el usuario permanece en el dashboard manteniendo sus filtros aplicados para poder reintentar

  Examples: Datos de salida esperados
    | Elemento                     | Resultado esperado                                                                                       |
    | Exportación exitosa          | Genera y descarga el PDF estático con toda la información visualizada y el mensaje de éxito              |
    | Fallo en la generación       | Muestra indicador de carga fallido y el mensaje de error para reintentar sin perder los filtros          |