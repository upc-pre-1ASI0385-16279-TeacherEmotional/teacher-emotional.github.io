# US17.feature
# Epic: Interfaz de Captura de Bienestar (EP02)

Feature: Selección de intensidad de la emoción

  Como docente
  Deseo indicar el grado de intensidad de mi sentimiento
  Para aportar mayor precisión a los datos analíticos de la institución

  Escenario: E01 - Selección de intensidad mediante el slider (flujo feliz)
  Dado que el docente ha seleccionado un emoji de sentimiento en la pantalla de registro emocional de TeacherEmotional (ej. 😢 Muy mal)
  Cuando desliza la barra de intensidad (slider) hacia un valor numérico, por ejemplo de 1 (leve) a 5 (muy intenso)
  Y selecciona el nivel 4
  Entonces el sistema registra ese nivel de intensidad vinculado al emoji seleccionado
  Y actualiza visualmente el valor numérico mostrado (ej. "Intensidad: 4/5")
  Y prepara el dato para ser guardado junto con el resto del registro emocional

  Escenario: E02 - Intensidad por defecto sin interacción con el slider (flujo alternativo)
  Dado que el docente ha seleccionado un emoji de sentimiento
  Cuando no interactúa con la barra de intensidad (la deja en su valor por defecto, ej. 3 de 5, o el slider está en posición media)
  Y presiona el botón "Guardar" directamente
  Entonces el sistema asigna automáticamente el valor de intensidad por defecto (ej. intensidad media = 3) al registro emocional
  Y no muestra advertencias ni obliga al docente a modificarlo
  Y el registro siempre cuenta con un nivel de intensidad (ya sea elegido activamente o por defecto)
  Y asegura completitud en los datos analíticos sin sobrecargar al usuario

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Interacción con slider       | El valor seleccionado se registra y se muestra visualmente (ej. "Intensidad: 4/5")                    |
  | Sin interacción con slider   | Se asigna el valor por defecto (3/5) sin advertencias, el registro se guarda completo                 |