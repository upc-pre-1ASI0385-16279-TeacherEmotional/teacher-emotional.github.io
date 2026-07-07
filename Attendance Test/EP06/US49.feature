# US49.feature
# Epic: Sistema de Comunicación y Alertas de Riesgo (EP06)

Feature: Resumen semanal automático por email (Docente)

  Como docente
  Deseo recibir un resumen de mi propia evolución emocional cada viernes
  Para tomar conciencia de mi salud mental y ver mis rachas de autocuidado

  Escenario: E01 - Envío exitoso del resumen semanal con datos (flujo feliz)
  Dado que ha finalizado la semana escolar (viernes)
  Y el docente ha realizado al menos un registro emocional durante la semana (lunes a viernes)
  Cuando llega el viernes a las 17:00 horas (hora configurada por defecto, ajustable por la institución)
  Y el sistema ejecuta la tarea programada para generar los resúmenes semanales
  Entonces el sistema genera y envía un correo electrónico al docente (a su correo registrado) que incluye:
  - Asunto: "Tu resumen emocional de la semana – [Nombre de la Institución]"
  - Cuerpo: Un mensaje motivador personalizado (ej. "¡Gracias por cuidar tu bienestar!"), seguido de un gráfico simple (ej. un gráfico de líneas o barras pequeñas incrustado como imagen) mostrando la evolución de sus emociones día a día (escala 1 a 5)
  - Métrica de racha: "Llevas 🔥 X días consecutivos registrando tu estado de ánimo. ¡Sigue así!"
  - Consejo o recurso recomendado (basado en su emoción predominante de la semana)
  Y el docente puede hacer clic en un enlace del correo para ir directamente a su historial personal en la app

  Escenario: E02 - Semana sin registros o error en el envío (flujo alternativo)
  Dado que ha finalizado la semana escolar (viernes a las 17:00 horas)
  Cuando el sistema detecta que el docente no realizó ningún registro emocional durante la semana (0 registros de lunes a viernes)
  O ocurre un error técnico en el servicio de correo (ej. servidor SMTP no responde, dirección de correo inválida)
  Entonces el sistema no envía el resumen con gráfico (porque no hay datos que mostrar)
  Y en su lugar:
  - Si no hay registros: envía un correo alternativo (o no envía nada, según política) con un mensaje amable: "Esta semana no registraste tu estado emocional. ¡Te invitamos a comenzar la próxima semana compartiendo cómo te sientes! Cada registro es un paso para cuidar tu salud mental." (sin gráfico)
  - Si hay error técnico: el sistema registra el fallo en los logs e intenta reenviar el correo hasta 2 veces más en las siguientes horas. Si persiste el error, se envía una alerta interna al administrador (sin molestar al docente)
  Y en ningún caso se envía información incompleta o errónea al docente, manteniendo la calidad del mensaje

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Semana con registros         | Correo con gráfico, racha, consejo y enlace al historial                                              |
  | Semana sin registros         | Correo alternativo sin gráfico, mensaje amable invitando a registrar                                  |
  | Error de envío               | Reintentos, si falla se notifica al administrador                                                     |