# US10.feature
# Epic: Interfaz de Captura de Bienestar (EP02)

Feature: Nota de texto opcional

  Como docente
  Deseo escribir un breve comentario en mi registro
  Para detallar las razones específicas de mi estado emocional del día

  Escenario: E01 - Registro exitoso con nota de texto (flujo feliz)
  Dado que el docente ha seleccionado un emoji en la pantalla de registro emocional de TeacherEmotional
  Cuando escribe un breve comentario en el área de texto opcional (ej. "Mucha presión por reunión con padres de familia")
  Y presiona el botón "Guardar" o "Enviar"
  Entonces el sistema almacena el comentario vinculado al registro emocional del día, de forma anónima
  Y confirma la acción con un mensaje: "Registro guardado con éxito."

  Escenario: E02 - Registro exitoso sin nota de texto (flujo alternativo - opcional)
  Dado que el docente ha seleccionado un emoji en la pantalla de registro emocional
  Cuando deja el área de texto opcional en blanco (sin escribir ningún comentario)
  Y presiona el botón "Guardar"
  Entonces el sistema almacena únicamente la emoción seleccionada (sin texto adicional)
  Y permite el guardado sin errores ni advertencias
  Y muestra el mismo mensaje de confirmación: "Registro guardado con éxito."
  Y el campo de texto queda disponible pero no es obligatorio en ningún momento, respetando la naturaleza opcional de la funcionalidad

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Registro con nota            | Se guarda la emoción y la nota, muestra mensaje de éxito                                             |
  | Registro sin nota            | Se guarda solo la emoción, muestra mensaje de éxito, campo opcional                                   |