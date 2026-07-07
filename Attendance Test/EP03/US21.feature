# US21.feature
# Epic: Visualización Analítica para la Toma de Decisiones (EP03)

Feature: Filtro de datos por nivel

  Como directivo
  Deseo filtrar la información por nivel educativo
  Para entender las necesidades específicas de cada grupo pedagógico

  Escenario: E01 - Filtrado exitoso por nivel educativo (flujo feliz)
  Dado que el directivo ha iniciado sesión en TeacherEmotional
  Y se encuentra visualizando el Dashboard general con gráficos y métricas agregadas de toda la institución (ej. gráfico de barras semanal, gráfico de líneas mensual, mapa de calor, etc.)
  Cuando selecciona el nivel "Secundaria" (o "Primaria", "Inicial", según corresponda) en el menú desplegable de filtros ubicado en la parte superior del panel
  Entonces todos los gráficos y métricas se actualizan automáticamente (sin recargar la página)
  Y muestran exclusivamente los datos correspondientes a los docentes de ese nivel educativo
  Y se muestra un indicador visual del filtro activo (ej. "Mostrando datos de: Secundaria")
  Y el directivo puede cambiar a otro nivel o quitar el filtro para volver a la vista general

  Escenario: E02 - Nivel sin datos o sin docentes asociados (flujo alternativo)
  Dado que el directivo se encuentra en el Dashboard general con el menú de filtros desplegable
  Cuando selecciona un nivel educativo que no tiene docentes asociados en la plataforma (ej. "Inicial" si la institución solo tiene secundaria)
  O los docentes de ese nivel no han realizado ningún registro emocional en el período visible
  Entonces el sistema muestra un mensaje informativo en el área principal de gráficos: "No hay datos disponibles para el nivel seleccionado. Asegúrate de que los docentes de este nivel estén registrados y hayan completado sus registros emocionales."
  Y los gráficos se muestran vacíos (o con un estado "sin datos")
  Y el filtro permanece activo hasta que el directivo lo cambie o lo limpie

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Filtro con datos disponibles | Gráficos y métricas se actualizan según el nivel seleccionado, se muestra indicador de filtro activo  |
  | Filtro sin datos             | Mensaje informativo, gráficos vacíos, filtro permanece activo                                        |