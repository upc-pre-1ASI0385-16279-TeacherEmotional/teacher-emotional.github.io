# US47.feature
# Epic: Sistema de Comunicación y Alertas de Riesgo (EP06)

Feature: Envío de correo automático al directivo por crisis

  Como directivo
  Deseo recibir un aviso por correo electrónico cuando el nivel de estrés sea crítico
  Para estar informado incluso si no tengo la aplicación abierta en ese momento

  Escenario: E01 - Envío exitoso de correo por crisis (flujo feliz)
  Dado que el sistema de TeacherEmotional ha procesado un reporte grupal (ej. análisis de los registros de las últimas 2 horas o del día parcial)
  Y detecta que el porcentaje de emociones negativas (😢 Muy mal, 😕 Mal) con intensidad alta supera el 50% (o el umbral crítico definido por el directivo)
  Cuando se valida la condición de alerta (cumple el umbral crítico)
  Entonces el sistema despacha automáticamente un correo electrónico al directivo (a su correo registrado en la plataforma) con:
  - Asunto: "⚠️ Alerta Crítica de Bienestar Docente – [Nombre de la Institución]"
  - Cuerpo: Un resumen ejecutivo de la situación, incluyendo el porcentaje exacto de negatividad, el período analizado, el área o nivel afectado (si se puede identificar) y un mensaje de recomendación
  - Un enlace directo al dashboard de TeacherEmotional (con token de acceso rápido o simplemente la URL) para que el directivo pueda ver los detalles y tomar acciones
  Y el sistema registra en el log de auditoría (US41) el envío del correo con fecha, hora y destinatario

  Escenario: E02 - Condición de alerta no cumplida o error de envío (flujo alternativo)
  Dado que el sistema procesa el reporte grupal
  Cuando el porcentaje de negatividad no supera el 50% (ej. 45%)
  O no hay suficientes registros para un análisis confiable (ej. menos de 10 docentes registrados en el período)
  O ocurre un error técnico en el servicio de correo (ej. servidor SMTP no responde, credenciales inválidas)
  Entonces el sistema no envía el correo de alerta en los casos de umbral no cumplido o datos insuficientes
  Y en caso de error técnico, el sistema registra el fallo en los logs internos (sin notificar al directivo, para evitar spam)
  Y puede reintentar el envío hasta 2 veces más en un intervalo corto
  Y si todos los intentos fallan, se envía una notificación interna al administrador del sistema (sin molestar al directivo) para que revise la configuración del correo

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Crisis detectada             | Correo enviado al directivo con resumen y enlace, registrado en auditoría                            |
  | Umbral no superado           | No se envía correo                                                                                   |
  | Datos insuficientes          | No se envía correo                                                                                   |
  | Error de envío               | Reintentos, si falla se notifica al administrador del sistema                                        |
