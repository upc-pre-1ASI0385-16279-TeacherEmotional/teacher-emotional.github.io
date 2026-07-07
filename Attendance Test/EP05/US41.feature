# US41.feature
# Epic: Gestión de Estructura Institucional (EP05)

Feature: Registro de actividad del sistema

  Como administrador
  Deseo ver una lista de las últimas acciones realizadas (ej. quién creó un usuario)
  Para tener un control de auditoría sobre los cambios en la plataforma

  Escenario: E01 - Visualización exitosa del registro de actividades (flujo feliz)
  Dado que el administrador ha iniciado sesión en TeacherEmotional con privilegios de auditoría
  Y accede a la sección "Auditoría" del módulo de administración
  Cuando el sistema carga la tabla de registros (mostrando las últimas acciones por defecto, ordenadas de más reciente a más antigua)
  Entonces se muestran las siguientes columnas de forma clara y cronológica:
  - "Fecha" (timestamp completo, ej. "25/05/2026 09:34:12")
  - "Usuario" (nombre del usuario que realizó la acción, ej. "Juan Pérez (directivo)")
  - "Acción" (tipo de operación, ej. "Creación de usuario", "Desactivación de cuenta", "Asignación de departamento")
  - "Detalle" (información adicional, ej. "Docente: María Gutiérrez", "Departamento: Matemáticas")
  Y la tabla soporta paginación (ej. 20 registros por página) y permite ordenar por cualquier columna (especialmente por fecha de forma ascendente/descendente)

  Escenario: E02 - Sin registros de actividad o error de carga (flujo alternativo)
  Dado que el administrador accede a la sección "Auditoría"
  Cuando el sistema consulta los registros y no hay acciones registradas (ej. plataforma recién instalada o aún sin actividad administrativa)
  O ocurre un error técnico al cargar los datos (ej. timeout del servidor, fallo en la base de datos)
  Entonces el sistema muestra un mensaje informativo según el caso:
  - Sin registros: "No hay actividades registradas hasta el momento. Las acciones administrativas aparecerán aquí a medida que se realicen."
  - Error de carga: "No se pudo cargar el registro de actividades. Por favor, intenta de nuevo más tarde."
  Y la tabla aparece vacía o con un estado de error
  Y se ofrece un botón de "Reintentar" en caso de fallo técnico

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Con registros                | Tabla con columnas Fecha, Usuario, Acción, Detalle, ordenada por fecha descendente                    |
  | Sin registros                | Mensaje informativo: "No hay actividades registradas..."                                              |
  | Error de carga               | Mensaje de error y botón "Reintentar"                                                                |