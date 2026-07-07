# US20.feature
# Epic: Visualización Analítica para la Toma de Decisiones (EP03)

Feature: Mapa de calor

  Como directivo
  Deseo ver un mapa de calor sobre los días de la semana con mayor carga de estrés
  Para planificar actividades de bienestar en los momentos más necesarios

  Escenario: E01 - Visualización exitosa del mapa de calor (flujo feliz)
  Dado que el directivo ha iniciado sesión en TeacherEmotional
  Y se encuentra en la sección "Puntos Críticos" del panel de analítica
  Cuando el sistema analiza los registros históricos de estrés alto (emociones 😢 Muy mal o 😕 Mal con intensidad ≥ 4) del período seleccionado (ej. últimos 60 días)
  Entonces el sistema presenta una cuadrícula de mapa de calor donde:
  - Filas: Días de la semana (Lunes a Viernes, o incluyendo Sábado/Domingo si hay datos)
  - Columnas: Horarios o bloques del día (ej. Mañana 6-12, Tarde 12-18, Noche 18-22)
  - Cada celda tiene un color que va de verde (baja incidencia) a rojo (alta incidencia), según la cantidad o porcentaje de reportes de estrés alto en ese día y horario
  Y al hacer hover sobre una celda, se muestra un tooltip con el valor numérico exacto (ej. "Martes tarde: 18 reportes de estrés alto, 42% del total de registros de ese bloque")

  Escenario: E02 - Sin datos suficientes para generar mapa de calor (flujo alternativo)
  Dado que el directivo abre la sección "Puntos Críticos"
  Cuando el sistema analiza los registros históricos pero no hay suficientes reportes de estrés alto en el período (ej. menos de 10 reportes totales, o menos de 3 días diferentes con datos)
  Entonces el sistema no genera el mapa de calor
  Y muestra un mensaje informativo: "No hay suficientes reportes de estrés alto para generar un mapa de calor. A medida que los docentes registren su estado emocional, podrás visualizar patrones."
  Y opcionalmente, muestra una cuadrícula de ejemplo o un estado "próximamente" con una ilustración motivacional para fomentar el registro diario

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Datos suficientes            | Mapa de calor con celdas coloreadas y tooltips interactivos                                          |
  | Datos insuficientes          | Mensaje informativo, sin mapa de calor, opcionalmente muestra estado "próximamente"                 |