# US35.feature
# Epic: Biblioteca de Bienestar y Soporte Preventivo (EP04)

Feature: Sugerencia de recurso basada en el emoji marcado

  Como docente
  Deseo recibir una recomendación automática después de registrar mi emoción
  Para obtener ayuda personalizada sin tener que buscarla manualmente

  Escenario: E01 - Sugerencia exitosa basada en emoción negativa o neutra (flujo feliz)
  Dado que el docente ha iniciado sesión en TeacherEmotional
  Y acaba de registrar una emoción específica (ej. 😢 Muy mal, 😕 Mal o 😐 Normal) en la pantalla de registro diario
  Y presiona el botón "Guardar"
  Cuando el sistema procesa el registro y, basado en la emoción seleccionada (y opcionalmente las etiquetas de causa de estrés o nivel de intensidad), identifica uno o varios recursos de bienestar relevantes (ej. meditación para ansiedad, artículo sobre manejo del estrés, video de pausa activa)
  Entonces inmediatamente después de la confirmación del registro, despliega un mensaje que dice: "Pensamos que esto te puede ayudar"
  Y muestra un link, tarjeta o botón con el título del recurso sugerido (ej. "Respiración consciente - Audio de 5 min")
  Y el docente puede hacer clic en el enlace para ir directamente al recurso, o cerrar/cancelar la sugerencia si no le interesa en ese momento

  Escenario: E02 - Sin sugerencia disponible (emoción positiva o sin recursos relacionados)
  Dado que el docente acaba de registrar una emoción positiva (ej. 🙂 Bien o 😄 Muy bien)
  O el sistema no encuentra recursos relacionados con la emoción registrada (ej. catálogo aún limitado o no hay coincidencias con las etiquetas)
  Cuando el sistema procesa el registro y determina que no es necesario recomendar ayuda (por bienestar positivo) o no hay recursos aplicables
  Entonces el sistema no despliega el mensaje de sugerencia
  Y simplemente muestra la confirmación estándar ("¡Gracias por compartir cómo te sientes!") sin ofrecer recursos adicionales
  Y en caso de que el docente haya registrado una emoción negativa pero no haya recursos, se puede mostrar un mensaje opcional más genérico: "Pronto añadiremos más recursos para ayudarte. ¡Vuelve pronto!" (sin forzar una interacción innecesaria)

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Emoción negativa con recurso | Muestra sugerencia con recurso relevante, opción de ir al recurso o cerrar                            |
  | Emoción positiva             | No muestra sugerencia, solo mensaje de confirmación estándar                                          |
  | Emoción negativa sin recurso | No muestra sugerencia, o muestra mensaje genérico "Pronto añadiremos más recursos"                    |