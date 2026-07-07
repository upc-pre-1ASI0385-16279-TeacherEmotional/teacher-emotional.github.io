# US15.feature
# Epic: Interfaz de Captura de Bienestar (EP02)

Feature: Visualización de "Racha" de registros diarios

  Como docente
  Deseo ver un contador de días consecutivos de registro
  Para motivarme a mantener la constancia en el monitoreo de mi salud mental

  Escenario: E01 - Visualización de racha activa (flujo feliz)
  Dado que el docente ha iniciado sesión en TeacherEmotional
  Y se encuentra en su panel principal (dashboard personal)
  Cuando visualiza la sección de estadísticas personales (ej. tarjeta de "Tu racha" o "Constancia")
  Entonces el sistema muestra un icono de fuego 🔥 acompañado del número de días consecutivos en los que el docente ha completado al menos un registro emocional (ej. "🔥 12 días")
  Y la racha se actualiza automáticamente cada día que el docente registra
  Y si falla un día, el contador se reinicia a 0 o muestra "🔥 0 días"

  Escenario: E02 - Sin racha o racha interrumpida (flujo alternativo)
  Dado que el docente ha iniciado sesión en su panel principal
  Cuando visualiza la sección de estadísticas personales
  Y no ha registrado emociones en el día de hoy (ej. aún no registra)
  O falló un día consecutivo en el pasado (ej. ayer no registró)
  Entonces el sistema muestra el icono de fuego apagado o gris (o un icono alternativo como 🧊)
  Y muestra el mensaje "Racha: 0 días" o "¡Comienza tu racha hoy!"
  Y si el docente ya registró hoy pero falló ayer, el contador muestra "🔥 1 día" (solo el día actual, ya que ayer se rompió)

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Racha activa                 | Muestra 🔥 N días consecutivos, se actualiza automáticamente                                         |
  | Sin registro hoy             | Muestra racha 0 o mensaje de inicio                                                                  |
  | Racha interrumpida ayer      | Reinicia a 0, si registra hoy muestra 1 día                                                          |