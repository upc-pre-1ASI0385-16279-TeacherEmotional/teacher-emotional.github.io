# US22.feature
# Epic: Visualización Analítica para la Toma de Decisiones (EP03)

Feature: Filtro de datos por departamento académico

  Como directivo
  Deseo segmentar los reportes por departamento
  Para identificar qué áreas académicas presentan mayor desgaste emocional

  Escenario: E01 - Filtrado exitoso por departamento académico (flujo feliz)
  Dado que el directivo ha iniciado sesión en TeacherEmotional
  Y se encuentra en la vista detallada del dashboard analítico (con gráficos de bienestar, niveles de estrés, etc.)
  Cuando aplica el filtro por un departamento académico específico (ej. "Matemáticas", "Comunicación", "Ciencias", etc.) desde el menú desplegable de filtros
  Entonces el sistema recalcula los promedios (ej. nivel de bienestar promedio, porcentaje de estrés alto)
  Y actualiza todos los indicadores visuales (gráfico de barras, líneas, mapa de calor)
  Para reflejar exclusivamente los datos de los docentes pertenecientes a ese departamento
  Y se muestra un indicador visible del filtro activo (ej. "Departamento: Matemáticas")
  Y se muestra un botón para "Limpiar filtros" o "Ver todos"

  Escenario: E02 - Departamento sin registros o sin docentes asignados (flujo alternativo)
  Dado que el directivo se encuentra en la vista detallada del dashboard con el filtro de departamento disponible
  Cuando selecciona un departamento académico que no tiene docentes registrados en la plataforma
  O los docentes de ese departamento no han realizado ningún registro emocional en el período analizado
  Entonces el sistema muestra un mensaje informativo en el área principal: "No hay datos disponibles para el departamento seleccionado. Verifica que los docentes de este departamento estén registrados y activos."
  Y los gráficos y métricas se muestran vacíos (ej. ejes sin barras, líneas planas sin puntos)
  Y el filtro permanece seleccionado hasta que el directivo lo cambie o lo limpie

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Filtro con datos disponibles | Gráficos y métricas se actualizan según el departamento seleccionado, se muestra indicador de filtro  |
  | Filtro sin datos             | Mensaje informativo, gráficos vacíos, filtro permanece activo                                        |