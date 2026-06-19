Feature: Registro de sentimientos al inicio del día

  Como docente
  Deseo registrar mi ánimo al ingresar al colegio
  Para tener una línea base de cómo comienzo mi jornada laboral.

  Escenario: E01 - Registro etiquetado como "Inicio de jornada"
    Dado que es el primer acceso del docente a "TeacherEmotional" en el horario de mañana
    Y aún no ha realizado ningún registro emocional en el día de hoy
    Cuando completa el formulario de registro emocional seleccionando un emoji, nota o etiquetas opcionales
    Y presiona el botón "Guardar"
    Entonces el sistema almacena el registro y etiqueta automáticamente la entrada como "Registro de Inicio" en el historial personal del docente
    Y permite diferenciar visualmente este registro del resto en el historial (ej. con un ícono de sol o etiqueta)

  Escenario: E02 - Registro sin etiqueta de inicio
    Dado que el docente accede a la plataforma en horario de tarde o noche o ya ha realizado al menos un registro emocional hoy
    Cuando completa el formulario de registro emocional y presiona el botón "Guardar"
    Entonces el sistema almacena el registro como un registro normal sin la etiqueta "Registro de Inicio"
    Y el historial personal del docente muestra el registro con la hora y fecha, pero sin el distintivo especial de inicio de jornada

  Examples: Datos de salida esperados
    | Elemento                     | Resultado esperado                                                                                       |
    | Registro de inicio exitoso   | Se registra y muestra en el historial del usuario con etiqueta distintiva de "Registro de Inicio"        |
    | Registro normal              | Se almacena el registro con hora y fecha estándar, sin marcas ni iconos especiales de inicio de jornada  |