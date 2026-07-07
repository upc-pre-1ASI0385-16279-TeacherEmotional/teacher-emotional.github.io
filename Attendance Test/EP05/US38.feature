# US38.feature
# Epic: Gestión de Estructura Institucional (EP05)

Feature: Desactivación de cuentas

  Como administrador
  Deseo desactivar el acceso de un docente que ya no labora en el colegio
  Para mantener la seguridad de la información y la integridad de los datos

  Escenario: E01 - Desactivación exitosa de cuenta docente (flujo feliz)
  Dado que el administrador ha iniciado sesión en TeacherEmotional
  Y se encuentra en el módulo de "Gestión de Usuarios" (EP05)
  Y ha localizado a un docente específico mediante búsqueda o navegación en la lista
  Cuando cambia el estado del usuario de "Activo" a "Inactivo" (mediante un botón/toggle o seleccionando la opción en un menú contextual)
  Y confirma la acción en un diálogo emergente (ej. "¿Estás seguro de desactivar este usuario? El docente ya no podrá iniciar sesión, pero sus registros históricos se mantendrán.")
  Entonces el sistema bloquea inmediatamente el inicio de sesión para ese usuario (si tenía una sesión activa, se cierra o se invalida su token)
  Y cambia su estado a "Inactivo" en la base de datos
  Y no se borran sus datos históricos (registros emocionales pasados)
  Y los registros permanecen en los reportes anonimizados del directivo (sin perder integridad de tendencias)
  Y se muestra un mensaje de éxito: "Usuario desactivado correctamente. El docente ya no podrá acceder a la plataforma."

  Escenario: E02 - Cancelación de desactivación o error (flujo alternativo)
  Dado que el administrador ha seleccionado a un usuario y ha iniciado el proceso de desactivación
  Cuando en el diálogo de confirmación, presiona "Cancelar" o cierra la ventana emergente (no confirma)
  O ocurre un error técnico durante el proceso de desactivación (ej. problema de conexión con el servidor, fallo al actualizar el estado)
  Entonces el sistema no modifica el estado del usuario – permanece como "Activo" – y mantiene su acceso intacto
  Y se muestra según el caso:
  - Si canceló: "Desactivación cancelada. No se realizaron cambios."
  - Si hubo error: "No se pudo desactivar al usuario. Por favor, intenta de nuevo más tarde."
  Y el administrador permanece en la misma pantalla de gestión de usuarios y puede reintentar la operación

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Desactivación confirmada     | Estado cambiado a "Inactivo", sesión bloqueada, datos históricos preservados, mensaje de éxito       |
  | Cancelación de desactivación | Estado permanece "Activo", mensaje de cancelación, administrador en la misma pantalla                |
  | Error técnico                | Estado permanece "Activo", mensaje de error, administrador en la misma pantalla                      |