# US14.feature
# Epic: Interfaz de Captura de Bienestar (EP02)

Feature: Edición del registro del mismo día

  Como docente
  Deseo corregir mi registro emocional del día actual
  Para asegurar que la información sea exacta en caso de haberme equivocado al marcar

  Escenario: E01 - Edición exitosa del registro del mismo día (flujo feliz)
  Dado que el docente ya ha guardado un registro emocional hoy (ya sea de "Inicio" o "Fin de jornada")
  Y actualmente se encuentra en su historial o panel principal de TeacherEmotional antes de la medianoche (ej. 10:00 p.m. del mismo día)
  Cuando selecciona la opción "Editar Registro" junto al registro del día actual
  Y modifica el emoji (ej. cambia de 😐 Normal a 🙂 Bien) y/o edita la nota de texto opcional
  Y presiona el botón "Guardar cambios"
  Entonces el sistema actualiza el registro existente (no crea uno nuevo)
  Y sobrescribe los datos anteriores con los modificados
  Y muestra un mensaje de confirmación: "Registro actualizado correctamente"
  Y en el historial se visualiza la versión corregida, sin perder la etiqueta original (Inicio o Fin de jornada)

  Escenario: E02 - Intento de edición de un día anterior o después de medianoche (flujo bloqueado)
  Dado que el docente intenta editar un registro emocional correspondiente a un día anterior al actual (ej. ayer)
  O ya ha pasado la medianoche (ej. 12:05 a.m. del día siguiente) y el registro pertenece al día anterior
  Cuando selecciona la opción "Editar Registro" junto a ese registro
  Entonces el sistema no permite la edición
  Y muestra un mensaje informativo: "Solo puedes editar los registros del día actual. Para días anteriores, no se permiten modificaciones para garantizar la integridad de los datos históricos."
  Y el botón "Editar" se deshabilita o desaparece para registros con fecha anterior al día actual
  O se mantiene visible pero al hacer clic muestra el mensaje sin abrir el formulario

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Edición de registro del día  | Se actualiza el registro existente, se muestra mensaje de confirmación, se mantiene la etiqueta       |
  | Edición de día anterior      | No se permite, muestra mensaje informativo                                                           |