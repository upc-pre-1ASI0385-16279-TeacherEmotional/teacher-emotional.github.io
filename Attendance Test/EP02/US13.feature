# US13.feature
# Epic: Interfaz de Captura de Bienestar (EP02)

Feature: Registro de sentimientos al fin de la jornada

  Como docente
  Deseo realizar un segundo registro al salir de clases
  Para reflejar cómo afectó la jornada escolar a mi bienestar emocional

  Escenario: E01 - Registro etiquetado como "Fin de jornada" (flujo feliz)
  Dado que el docente ya ha realizado al menos un registro emocional en el día de hoy (puede ser el "Registro de Inicio" o cualquier otro)
  Y actualmente accede a TeacherEmotional en el horario de fin de jornada laboral (ej. entre las 2:00 p.m. y las 7:00 p.m., configurable según cada institución)
  Cuando completa el formulario de registro emocional (selecciona un emoji, opcionalmente añade nota y/o etiquetas)
  Y presiona el botón "Guardar"
  Entonces el sistema almacena el registro
  Y etiqueta automáticamente la entrada como "Registro de Fin de Jornada" en el historial personal del docente
  Y permite visualizar la evolución de su estado emocional entre el inicio y el final del día laboral

  Escenario: E02 - Intento de registro de fin de jornada sin registro previo (flujo alternativo)
  Dado que el docente accede a la plataforma en el horario de fin de jornada laboral
  Y no ha realizado ningún registro emocional en el día de hoy (por ejemplo, olvidó registrar por la mañana)
  Cuando intenta completar y guardar un registro emocional en este horario
  Entonces el sistema igualmente permite el registro y lo guarda con normalidad
  Y muestra un mensaje informativo: "Nota: Para ver tu evolución diaria, recuerda registrar también tu estado al inicio de la jornada."
  Y el registro se etiqueta como "Registro de Fin de Jornada" (o alternativamente como "Registro único del día")
  Y no hay comparativa disponible hasta que exista un registro de inicio en fechas posteriores

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Registro con inicio previo   | Se etiqueta como "Fin de Jornada" y se muestra la evolución diaria                                   |
  | Registro sin inicio previo   | Se etiqueta como "Fin de Jornada" o "Registro único", se muestra mensaje informativo                  |