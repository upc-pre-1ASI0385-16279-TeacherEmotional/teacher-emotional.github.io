# US45.feature
# Epic: Sistema de Comunicación y Alertas de Riesgo (EP06)

Feature: Notificación push de recordatorio de registro

  Como docente con muchas tareas
  Deseo recibir un recordatorio amable en mi navegador
  Para no olvidar realizar mi registro emocional antes de que termine la jornada laboral

  Escenario: E01 - Notificación push exitosa por falta de registro (flujo feliz)
  Dado que el docente ha iniciado sesión en TeacherEmotional
  Y tiene la sesión abierta en su navegador (permisos de notificación concedidos)
  Y falta aproximadamente una hora para el fin de su jornada laboral (ej. la institución definió fin de jornada a las 6:00 p.m., son las 5:00 p.m.)
  Cuando el sistema detecta que el docente aún no ha realizado ningún registro emocional en el día (ni de inicio ni de fin de jornada)
  Entonces dispara una notificación emergente en pantalla (tipo push en la esquina inferior o superior derecha del navegador)
  Y muestra el mensaje: "¡Hola! Aún no registraste cómo te sientes hoy. Tómate un minuto para compartir tu estado de ánimo antes de cerrar tu jornada."
  Y la notificación incluye un botón "Registrar ahora" que, al hacer clic, redirige al docente directamente a la pantalla de registro emocional
  Y si el docente ignora o cierra la notificación, esta no se vuelve a mostrar hasta el día siguiente (o en el próximo intervalo configurado)

  Escenario: E02 - No se dispara notificación (docente ya registró o permisos denegados)
  Dado que el docente tiene la sesión abierta en el navegador y es una hora antes del fin de la jornada
  Cuando el sistema detecta que el docente ya realizó al menos un registro emocional hoy (ya sea de inicio o fin de jornada)
  O el navegador no tiene concedidos los permisos para mostrar notificaciones push (el usuario las bloqueó previamente)
  O el docente está inactivo o con la sesión cerrada
  Entonces el sistema no dispara la notificación de recordatorio en ninguno de estos casos
  Y evita molestar al usuario que ya cumplió o que no puede recibir notificaciones
  Y si los permisos están denegados, el sistema puede mostrar un mensaje silencioso dentro de la propia app (ej. un badge o banner interno opcional), pero sin intentar forzar la notificación push

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Docente sin registro         | Notificación push con mensaje y botón "Registrar ahora"                                               |
  | Docente con registro         | No se dispara notificación                                                                           |
  | Permisos denegados           | No se dispara notificación, opcionalmente muestra un badge interno                                    |
  | Sesión cerrada/inactiva      | No se dispara notificación                                                                           |