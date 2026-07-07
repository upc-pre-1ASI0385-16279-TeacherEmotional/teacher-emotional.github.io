# US12.feature
# Epic: Interfaz de Captura de Bienestar (EP02)

Feature: Registro de sentimientos al inicio del día

  Como docente
  Deseo registrar mi ánimo al ingresar al colegio
  Para tener una línea base de cómo comienzo mi jornada laboral

  Escenario: E01 - Registro etiquetado como "Inicio de jornada"
  Dado que es el primer acceso del docente a TeacherEmotional en el horario de mañana (ej. entre las 6:00 a.m. y las 11:59 a.m., según la zona horaria local)
  Y aún no ha realizado ningún registro emocional en el día de hoy
  Cuando completa el formulario de registro emocional (selecciona un emoji, opcionalmente añade nota y/o etiquetas)
  Y presiona el botón "Guardar"
  Entonces el sistema almacena el registro
  Y etiqueta automáticamente la entrada como "Registro de Inicio" en el historial personal del docente
  Y permite diferenciar visualmente (ej. con un ícono de sol o etiqueta) este registro del resto que pueda hacer durante el día

  Escenario: E02 - Registro sin etiqueta de inicio
  Dado que el docente accede a la plataforma en horario de tarde o noche (ej. después de las 12:00 p.m.)
  O ya ha realizado al menos un registro emocional en el día de hoy (incluso si es de mañana)
  Cuando completa el formulario de registro emocional y presiona "Guardar"
  Entonces el sistema almacena el registro como un registro normal (sin la etiqueta "Registro de Inicio")
  Y no cumple las condiciones de ser el primer acceso matutino del día
  Y el historial personal del docente muestra el registro con la hora y fecha, pero sin el distintivo especial de inicio de jornada

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Registro en horario matutino | Se etiqueta como "Registro de Inicio" y se muestra con ícono o distintivo en el historial             |
  | Registro en horario tarde/noche | Se almacena como registro normal, sin etiqueta de inicio                                            |
  | Segundo registro del día     | Aunque sea de mañana, no se etiqueta como inicio porque ya hay un registro previo                    |