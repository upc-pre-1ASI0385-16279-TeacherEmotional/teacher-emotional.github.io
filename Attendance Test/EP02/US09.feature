# US09.feature
# Epic: Interfaz de Captura de Bienestar (EP02)

Feature: Selección de emoji de ánimo

  Como docente
  Deseo elegir un emoji que represente mi estado actual
  Para registrar mi emoción de forma visual y rápida

  Escenario: E01 - Selección exitosa de un emoji (flujo feliz)
  Dado que el docente ha iniciado sesión en TeacherEmotional
  Y se encuentra en la pantalla de registro emocional diario
  Y se muestra una escala visual de 5 emojis: 😢 Muy mal, 😕 Mal, 😐 Normal, 🙂 Bien, 😄 Muy bien
  Cuando hace clic sobre uno de los emojis de la escala (ej. 🙂 Bien)
  Entonces el sistema resalta visualmente el icono seleccionado (borde de color, sombra o agrandamiento)
  Y registra internamente la emoción elegida
  Y habilita automáticamente el botón de "Guardar" o "Registrar emoción", que antes estaba deshabilitado o en gris

  Escenario: E02 - Selección previa sin guardado (cambio de opción)
  Dado que el docente se encuentra en la pantalla de registro emocional
  Y ya ha seleccionado un emoji previamente (ej. 😕 Mal) pero no ha presionado "Guardar"
  Cuando hace clic en un nuevo emoji diferente (ej. 😄 Muy bien)
  Entonces el sistema cambia el resalte al nuevo emoji seleccionado
  Y elimina el resalte del anterior
  Y actualiza la emoción pendiente de guardado
  Y el botón "Guardar" permanece habilitado
  Y permite al usuario cambiar de opinión cuantas veces desee antes de confirmar su registro

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Selección de emoji           | El emoji seleccionado se resalta visualmente, se registra internamente                               |
  | Botón "Guardar"              | Se habilita automáticamente al seleccionar un emoji                                                 |
  | Cambio de emoji              | Se actualiza el resalte y la emoción pendiente, el botón permanece habilitado                        |