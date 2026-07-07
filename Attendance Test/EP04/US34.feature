# US34.feature
# Epic: Biblioteca de Bienestar y Soporte Preventivo (EP04)

Feature: Botón de "Calificar recurso"

  Como docente
  Deseo indicar si un contenido fue útil o no
  Para ayudar al sistema a priorizar los mejores materiales para el resto de la comunidad

  Escenario: E01 - Calificación exitosa de recurso (flujo feliz)
  Dado que el docente ha iniciado sesión en TeacherEmotional
  Y ha consumido (visto, escuchado o leído) un recurso de bienestar (ej. video de pausa activa, meditación guiada o artículo)
  Y se encuentra al final del contenido o en la tarjeta del recurso
  Cuando marca la opción "Útil" (pulgar arriba 👍) o "No útil" (pulgar abajo 👎) según su experiencia
  Entonces el sistema registra el voto del docente asociado a ese recurso
  Y evita que el mismo usuario pueda votar nuevamente por el mismo recurso (o permite cambiar su voto si vuelve a seleccionar la otra opción)
  Y se actualiza el contador de valoraciones del recurso en tiempo real (ej. "12 usuarios consideran esto útil" o "4 no útil")
  Y se muestra un breve mensaje de confirmación: "¡Gracias por tu calificación! Ayudas a mejorar los recursos para todos."

  Escenario: E02 - Intento de votar sin haber consumido el recurso (flujo alternativo)
  Dado que el docente se encuentra en la galería de bienestar visualizando la tarjeta de un recurso (aún no lo ha abierto o consumido)
  Cuando intenta hacer clic en el botón de calificación ("Útil" o "No útil") sin haber accedido al contenido completo
  Y el sistema detecta que no ha visto el video/leído el artículo/escuchado el audio hasta el final o al menos durante un tiempo mínimo
  Entonces el sistema no registra el voto
  Y muestra un mensaje informativo: "Por favor, consume el recurso antes de calificarlo. Queremos saber tu opinión sincera después de usarlo."
  Y el botón de calificación permanece visible pero deshabilitado o muestra el mensaje al hacer clic, incentivando la interacción genuina con el contenido

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Calificación exitosa         | Voto registrado, contador actualizado en tiempo real, mensaje de confirmación                         |
  | Voto sin consumir recurso    | Voto no registrado, mensaje informativo, botón deshabilitado o con mensaje al hacer clic              |