# US19.feature
# Epic: Visualización Analítica para la Toma de Decisiones (EP03)

Feature: Gráfico de líneas mensual

  Como directivo
  Deseo observar un gráfico de líneas con la evolución emocional del mes
  Para detectar tendencias o picos de estrés relacionados con fechas específicas

  Escenario: E01 - Visualización exitosa del gráfico de líneas mensual (flujo feliz)
  Dado que el directivo ha iniciado sesión en TeacherEmotional con su rol
  Y se encuentra en el panel de analítica (dashboard de bienestar)
  Cuando accede a la vista de historial mensual (ej. selecciona "Mensual" en el selector de período o el sistema carga automáticamente los datos de los últimos 30 días)
  Entonces se renderiza un gráfico de líneas con:
  - Eje X: Días del mes (1 al 30/31, o fechas consecutivas)
  - Eje Y: Nivel promedio de bienestar (escala 1 a 5, donde 1 = muy mal, 5 = muy bien) o porcentaje de emociones positivas vs negativas
  - Una línea que muestra la fluctuación diaria del bienestar grupal (datos anonimizados agregados)
  Y se marcan visualmente (ej. con un punto o círculo) los picos de estrés (valores bajos)
  Y se puede hacer hover sobre cada punto para ver el valor exacto y la fecha

  Escenario: E02 - Datos insuficientes en el período mensual (flujo alternativo)
  Dado que el directivo accede al historial mensual
  Cuando el período de 30 días seleccionado tiene menos del 50% de días con registros (ej. solo 10 de 30 días tienen al menos un registro docente)
  O ningún registro en varios días consecutivos
  Entonces el sistema muestra un mensaje informativo junto al gráfico: "Datos limitados en este período. Algunos días no tienen suficientes registros para mostrar una tendencia confiable. Recuerda fomentar el registro diario."
  Y el gráfico se renderiza igualmente, pero con interrupciones en la línea (huecos) en los días sin datos
  Y se desactiva la opción de "tendencias predictivas" hasta contar con más información

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Datos mensuales suficientes  | Gráfico de líneas con puntos interactivos, picos de estrés marcados                                   |
  | Datos insuficientes          | Mensaje informativo, gráfico con huecos y opción de tendencias predictivas desactivada               |