# US23.feature
# Epic: Visualización Analítica para la Toma de Decisiones (EP03)

Feature: Comparativa entre dos periodos de tiempo

  Como directivo
  Deseo comparar las métricas emocionales de dos meses distintos
  Para evaluar la efectividad de las medidas de apoyo implementadas

  Escenario: E01 - Comparación exitosa entre dos periodos (flujo feliz)
  Dado que el directivo ha iniciado sesión en TeacherEmotional
  Y accede a la herramienta de comparación dentro del panel de analítica
  Cuando selecciona dos rangos de fechas diferentes (ej. Periodo A: 1 al 30 de marzo, Periodo B: 1 al 30 de abril) mediante los selectores de fechas o pickers
  Y presiona el botón "Comparar"
  Entonces el sistema superpone los gráficos de ambos periodos (ej. dos líneas de diferentes colores en el gráfico de líneas, o dos grupos de barras lado a lado)
  Y muestra métricas clave comparadas: promedio de bienestar, porcentaje de estrés alto, tasa de participación, etc.
  Y se muestra una leyenda clara identificando cada periodo (ej. "Marzo (azul)" y "Abril (verde)")
  Y se muestra un resumen textual: "Abril mostró una mejora del 12% en el bienestar promedio respecto a marzo."

  Escenario: E02 - Selección inválida o sin datos en uno de los periodos (flujo alternativo)
  Dado que el directivo accede a la herramienta de comparación
  Cuando selecciona dos rangos de fechas donde uno o ambos periodos no tienen registros emocionales suficientes (ej. periodo A con datos, periodo B sin registros)
  O selecciona rangos superpuestos o con fechas incorrectas (ej. periodo B comienza antes de que termine periodo A)
  Entonces el sistema no genera la comparación
  Y muestra un mensaje de error específico según el caso:
  - Si un periodo no tiene datos: "El periodo [fechas] no contiene registros suficientes. No se puede realizar la comparación."
  - Si los rangos se superponen: "Los periodos seleccionados no deben superponerse. Elige rangos separados."
  Y los selectores de fechas se mantienen para que el directivo corrija la selección
  Y los gráficos anteriores (si los había) no se modifican hasta que la nueva selección sea válida

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Comparación válida           | Gráficos superpuestos, leyenda, resumen textual con mejora/retroceso                                 |
  | Periodo sin datos            | Mensaje de error específico: "El periodo [fechas] no contiene registros suficientes..."              |
  | Rangos superpuestos          | Mensaje de error: "Los periodos seleccionados no deben superponerse..."                              |