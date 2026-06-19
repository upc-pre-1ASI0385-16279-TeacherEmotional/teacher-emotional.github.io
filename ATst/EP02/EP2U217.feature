Feature: Selección de intensidad de la emoción

  Como docente
  Deseo indicar el grado de intensidad de mi sentimiento
  Para aportar mayor precisión a los datos analíticos de la institución.

  Escenario: E01 - Selección de intensidad mediante el slider (flujo feliz)
    Dado que el docente ha seleccionado un emoji de sentimiento en la pantalla de registro emocional de "TeacherEmotional"
    Cuando desliza la barra de intensidad (slider) hacia un valor numérico de 1 (leve) a 5 (muy intenso) y selecciona el nivel 4
    Entonces el sistema registra ese nivel de intensidad vinculado al emoji seleccionado
    Y actualiza visualmente el valor numérico mostrado (ej. "Intensidad: 4/5")
    Y prepara el dato para ser guardado junto con el resto del registro emocional

  Escenario: E02 - Intensidad por defecto sin interacción con el slider (flujo alternativo)
    Dado que el docente ha seleccionado un emoji de sentimiento
    Cuando no interactúa con la barra de intensidad dejándola en su posición media por defecto
    Y presiona el botón "Guardar" directamente
    Entonces el sistema asigna automáticamente el valor de intensidad por defecto al registro emocional sin mostrar advertencias
    Y asegura la completitud en los datos analíticos guardando la información en el historial sin sobrecargar al usuario

  Examples: Datos de salida esperados
    | Elemento                     | Resultado esperado                                                                                       |
    | Registro con selección       | Se almacena exitosamente el estado de ánimo y la intensidad elegida por el docente en el historial       |
    | Registro por defecto         | Guarda la intensidad media por defecto (3/5) y mantiene el último emoji para la siguiente sesión        |