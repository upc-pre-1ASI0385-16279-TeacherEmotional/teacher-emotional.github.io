# US40.feature
# Epic: Gestión de Estructura Institucional (EP05)

Feature: Asignación de docentes a áreas específicas

  Como administrador
  Deseo vincular a cada docente con su respectivo departamento
  Para que el directivo pueda filtrar los niveles de estrés por áreas de trabajo

  Escenario: E01 - Asignación exitosa de docente a un departamento (flujo feliz)
  Dado que el administrador ha iniciado sesión en TeacherEmotional
  Y se encuentra en el módulo de "Gestión de Usuarios" (EP05)
  Y ha accedido al perfil de un docente específico
  Cuando selecciona un departamento del menú desplegable (ej. "Matemáticas", "Comunicación", "Ciencias")
  Y presiona el botón "Guardar cambios"
  Entonces el sistema actualiza la relación entre el docente y el departamento seleccionado
  Y a partir de ese momento agrupa los datos emocionales de ese docente bajo la nueva categoría en el Dashboard (filtros por departamento, reportes comparativos, etc.)
  Y se muestra un mensaje de éxito: "Departamento asignado correctamente al docente."
  Y el perfil del docente refleja el cambio inmediatamente

  Escenario: E02 - Intento de asignación sin departamentos creados o cambio cancelado (flujo alternativo)
  Dado que el administrador accede al perfil de un docente
  Cuando el menú desplegable de departamentos está vacío porque el administrador no ha creado ningún departamento previamente en la configuración de "Estructura" (US39)
  O el administrador selecciona un departamento pero luego presiona "Cancelar" en lugar de "Guardar cambios"
  Entonces el sistema no actualiza la relación del docente – permanece sin departamento asignado o con el departamento anterior (si lo tenía)
  Y se muestra según el caso:
  - Si no hay departamentos: mensaje informativo: "No hay departamentos creados. Primero crea departamentos en Configuración > Estructura." y el campo desplegable aparece deshabilitado o con opción "Sin departamentos disponibles".
  - Si canceló: "Cambios descartados. No se asignó ningún departamento."
  Y el perfil del docente se mantiene sin modificar

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Asignación exitosa           | Departamento actualizado, datos agrupados en dashboard, mensaje de éxito, perfil refleja el cambio   |
  | Sin departamentos creados    | Mensaje informativo, campo deshabilitado o sin opciones, perfil sin cambios                           |
  | Cancelación de asignación    | Mensaje "Cambios descartados", perfil sin cambios                                                     |