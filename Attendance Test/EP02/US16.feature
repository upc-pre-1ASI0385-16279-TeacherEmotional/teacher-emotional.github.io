# US16.feature
# Epic: Interfaz de Captura de Bienestar (EP02)

Feature: Confirmación visual tras registro

  Como docente
  Deseo recibir un mensaje de confirmación exitosa
  Para tener la seguridad de que mis datos fueron procesados correctamente por el sistema

  Escenario: E01 - Confirmación exitosa tras guardado (flujo feliz)
  Dado que el docente ha completado el registro emocional (seleccionó emoji, opcionalmente nota y etiquetas)
  Y presiona el botón "Finalizar Registro"
  Cuando los datos se guardan correctamente en la base de datos de TeacherEmotional
  Entonces el sistema despliega una animación de check verde (ej. ícono de ✓ con efecto de rebote o desvanecimiento)
  Y muestra un mensaje textual: "¡Gracias por compartir cómo te sientes!"
  Y después de 2-3 segundos, la animación desaparece automáticamente
  Y el usuario es redirigido a su panel principal o se limpia el formulario para un posible nuevo registro

  Escenario: E02 - Error en el guardado (flujo alternativo - fallo técnico)
  Dado que el docente ha completado el formulario
  Y presiona el botón "Finalizar Registro"
  Cuando ocurre un error al guardar los datos (ej. pérdida de conexión a internet, timeout del servidor, o error interno)
  Entonces el sistema no muestra la animación de check verde ni el mensaje de agradecimiento
  Y muestra un mensaje de error claro (ej. "No se pudo guardar tu registro. Revisa tu conexión e inténtalo de nuevo.") con un ícono de advertencia ⚠️ o cruz roja ❌
  Y el formulario permanece con los datos ingresados para que el docente pueda reintentar el guardado sin perder lo escrito
  Y el botón "Finalizar Registro" se mantiene habilitado

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Guardado exitoso             | Animación check verde, mensaje de agradecimiento, redirección o limpieza                             |
  | Error en guardado            | Mensaje de error claro, formulario conserva datos, botón habilitado para reintentar                  |