
# US50.feature
# Epic: Sistema de Comunicación y Alertas de Riesgo (EP06)

Feature: Resumen mensual automático por email (Directivo)

  Como directivo
  Deseo recibir un reporte consolidado al final del mes
  Para tener un archivo histórico del clima laboral sin necesidad de generar el reporte manualmente

  Escenario: E01 - Envío exitoso del resumen mensual con PDF adjunto (flujo feliz)
  Dado que es el último día del mes calendario (ej. 31 de mayo, 30 de junio, etc.)
  Y se han cerrado los registros del período (generalmente a las 23:59 horas del último día)
  Cuando el sistema ejecuta la tarea programada (ej. el día 1 del mes siguiente a las 8:00 a.m., procesando el mes anterior)
  Y compila las métricas de participación y niveles de estrés de la institución
  Entonces el sistema genera un archivo PDF con el reporte consolidado que incluye:
  - Portada con nombre de la institución, logo y título "Reporte Mensual de Bienestar Docente"
  - Métricas clave: tasa de participación promedio mensual (% de docentes activos que registraron), porcentaje de emociones negativas/positivas, evolución vs mes anterior (si existe)
  - Gráficos principales (barras semanales, líneas de tendencia, mapa de calor resumido)
  - Principales alertas o hallazgos (picos de estrés, días críticos)
  Y el sistema adjunta automáticamente el PDF a un correo electrónico enviado al directivo (a su correo registrado)
  Con asunto: "Reporte Mensual de Bienestar – [Mes, Año] – [Nombre de la Institución]"
  Y un mensaje breve: "Adjunto encontrarás el resumen consolidado del clima laboral del mes pasado. Puedes revisarlo para tomar decisiones informadas."

  Escenario: E02 - Mes sin registros o error en la generación/envío (flujo alternativo)
  Dado que es el momento de generar el resumen mensual
  Cuando el sistema detecta que durante el mes no hubo registros emocionales (tasa de participación 0%)
  O ocurre un error técnico durante la generación del PDF (ej. librería de gráficos falla, servidor sin memoria)
  O el servicio de correo no responde
  Entonces el sistema no envía un PDF vacío o corrupto
  Y en su lugar:
  - Si no hay registros: envía un correo informativo sin adjunto, con el mensaje: "Durante el mes de [Mes], no se registraron emociones en la plataforma. Te recordamos la importancia de fomentar el registro diario entre los docentes para obtener reportes significativos."
  - Si hay error técnico: el sistema registra el fallo en los logs internos y reintenta la generación y envío hasta 3 veces en las siguientes 24 horas. Si todos los intentos fallan, envía una alerta al administrador del sistema (sin molestar al directivo con múltiples correos fallidos)
  Y en ningún caso se genera un archivo PDF inválido o se envía información engañosa al directivo

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Mes con registros            | Correo con PDF adjunto, métricas, gráficos y hallazgos                                               |
  | Mes sin registros            | Correo informativo sin adjunto, mensaje recordatorio                                                 |
  | Error de generación/envío    | Reintentos, si falla se notifica al administrador                                                     |