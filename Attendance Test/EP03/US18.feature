Feature: Gráfico de barras semanal

  Como directivo
  Deseo visualizar un gráfico analítico del bienestar emocional
  Para identificar tendencias mensuales y tomar decisiones informadas en la institución.

  Escenario: E01 - Visualización exitosa del gráfico de líneas mensual (flujo feliz)
    Dado que el directivo ha iniciado sesión en "TeacherEmotional" y se encuentra en el panel de analítica
    Cuando accede a la vista de historial mensual seleccionando el período de los últimos 30 días
    Entonces el sistema renderiza un gráfico de líneas con los días del mes en el Eje X y el nivel promedio de bienestar en el Eje Y
    Y muestra una línea con la fluctuación diaria del bienestar grupal agregada de forma anónima
    Y marca visualmente los picos de estrés permitiendo hacer hover sobre cada punto para ver el valor exacto y la fecha

  Escenario: E02 - Datos insuficientes en el período mensual (flujo alternativo)
    Dado que el directivo se encuentra en el panel de analítica y accede al historial mensual
    Cuando el período seleccionado cuenta con menos del 50% de días con registros o datos insuficientes
    Entonces el sistema renderiza el gráfico de líneas con interrupciones o huecos en los días vacíos
    Y muestra el mensaje informativo al lado del gráfico: "Datos limitados en este período. Algunos días no tienen suficientes registros para mostrar una tendencia confiable. Recuerda fomentar el registro diario."
    Y desactiva la opción de tendencias predictivas hasta contar con más información

  Examples: Datos de salida esperados
    | Elemento                     | Resultado esperado                                                                                       |
    | Gráfico completo             | Muestra el gráfico de líneas continuo con días del mes, promedio de bienestar y fluctuación diaria       |
    | Gráfico con datos limitados  | Muestra la gráfica con espacios vacíos e interrupciones por falta de registros de por lo menos 15 días  |
    | Alerta de datos limitados    | Despliega el mensaje de advertencia sobre la fiabilidad de la tendencia al lado del gráfico renderizado  |