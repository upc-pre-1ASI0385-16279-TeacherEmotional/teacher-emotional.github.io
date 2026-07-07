# US46.feature
# Epic: Sistema de Comunicación y Alertas de Riesgo (EP06)

Feature: Alerta visual roja en Dashboard por riesgo

  Como directivo
  Deseo ver un indicador de alerta rojo en mi panel principal cuando hay crisis
  Para priorizar mi atención en las áreas que requieren intervención urgente

  Escenario: E01 - Alerta roja activa por superación del umbral de estrés (flujo feliz)
  Dado que el análisis de datos de TeacherEmotional ha detectado un pico de estrés grupal en las últimas 24 horas (ej. 45% de registros de estrés alto, superando el umbral configurado del 40% en US44)
  Y específicamente en el nivel secundaria o en el departamento de Matemáticas
  Cuando el directivo inicia sesión y carga su dashboard principal (vista de analítica)
  Entonces el sistema muestra un banner rojo destacado en la parte superior del panel o directamente sobre el gráfico del área afectada
  Y muestra el mensaje: "⚠️ Alerta de Riesgo Emocional Detectada"
  Y un subtítulo indicando el área específica (ej. "Departamento de Matemáticas – 45% de reportes de estrés alto en las últimas 24 horas")
  Y el banner incluye un botón de acción "Ver detalles" que redirige al directivo a la sección de "Puntos Críticos" (US20) o a un desglose con recomendaciones de intervención

  Escenario: E02 - Sin alerta roja (niveles de estrés dentro del umbral)
  Dado que el análisis de datos detecta que los niveles de estrés grupal no superan el umbral configurado (ej. 25% de estrés alto, con umbral del 40%)
  O no hay registros suficientes para generar una alerta confiable
  Cuando el directivo carga su dashboard
  Entonces el sistema no muestra el banner rojo de alerta de riesgo emocional
  Y en su lugar, puede mostrar un indicador verde o un mensaje neutral (opcional) como: "Los niveles de bienestar se mantienen dentro de lo esperado."
  Y los gráficos y métricas se muestran con normalidad, sin ningún elemento visual que genere alarma innecesaria
  Y permite al directivo revisar los datos sin distracciones

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Estrés supera umbral         | Banner rojo con mensaje y área específica, botón "Ver detalles"                                     |
  | Estrés dentro de umbral      | No se muestra banner rojo, indicador verde o mensaje neutral                                        |
  | Datos insuficientes          | No se muestra banner rojo, mensaje neutral                                                           |