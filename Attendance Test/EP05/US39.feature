# US39.feature
# Epic: Gestión de Estructura Institucional (EP05)

Feature: Creación y edición de departamentos

  Como administrador
  Deseo definir las áreas académicas del colegio
  Para que los reportes emocionales reflejen la estructura real de la institución

  Escenario: E01 - Creación exitosa de un nuevo departamento (flujo feliz)
  Dado que el administrador ha iniciado sesión en TeacherEmotional
  Y se encuentra en la sección de configuración de "Estructura" (módulo EP05), donde se gestionan los departamentos académicos
  Cuando añade un nuevo nombre de departamento (ej. "Matemáticas", "Comunicación", "Ciencias Sociales") en el campo de texto
  Y presiona el botón "Guardar"
  Entonces el sistema valida que el nombre no esté duplicado (no exista ya un departamento con el mismo nombre en la institución)
  Y lo guarda en la base de datos
  Y habilita automáticamente esa categoría en toda la plataforma para que:
  - Los administradores puedan asignar docentes a ese departamento
  - Los filtros de reportes (US22) incluyan el nuevo departamento
  Y se muestra un mensaje de éxito: "Departamento 'Matemáticas' creado correctamente."
  Y el nuevo departamento aparece en la lista visible de departamentos existentes

  Escenario: E02 - Intento de crear un departamento duplicado o nombre inválido (flujo alternativo)
  Dado que el administrador se encuentra en la configuración de "Estructura"
  Cuando intenta añadir un departamento con un nombre que ya existe en la institución (ej. ya hay "Matemáticas" y vuelve a escribir "Matemáticas")
  O deja el campo de texto vacío
  O ingresa un nombre con caracteres no permitidos (ej. solo símbolos)
  Entonces el sistema no crea el nuevo departamento
  Y muestra un mensaje de error específico:
  - "Ya existe un departamento con este nombre. Usa un nombre diferente."
  - "El nombre del departamento no puede estar vacío."
  - "Usa solo letras, números y espacios para el nombre del departamento."
  Y el campo de texto no se limpia (para que el administrador pueda corregirlo)
  Y el botón "Guardar" permanece habilitado solo cuando el nombre es válido y único

  Escenario: E03 - Edición o eliminación de un departamento (adicional opcional)
  Dado que el administrador está en la lista de departamentos existentes
  Cuando selecciona un departamento y elige la opción de editar (cambiar nombre) o eliminar (si no tiene docentes asignados activos)
  Entonces el sistema permite modificar el nombre (siguiendo las mismas reglas de unicidad) o lo elimina permanentemente
  Y actualiza los filtros y reportes en consecuencia
  Y si se intenta eliminar un departamento con docentes activos asignados, el sistema muestra una advertencia: "No se puede eliminar el departamento porque tiene docentes asignados. Reasigna o desactiva esos docentes primero."

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Creación exitosa             | Departamento guardado, disponible en asignaciones y filtros, mensaje de éxito                         |
  | Nombre duplicado             | Mensaje de error "Ya existe un departamento..." campo no se limpia                                    |
  | Nombre vacío                 | Mensaje de error "El nombre del departamento no puede estar vacío."                                   |
  | Caracteres no permitidos     | Mensaje de error "Usa solo letras, números y espacios..."                                             |
  | Edición de departamento      | Nombre actualizado, filtros y reportes se actualizan                                                  |
  | Eliminación sin docentes     | Departamento eliminado permanentemente                                                                |
  | Eliminación con docentes     | Mensaje de advertencia, no se permite eliminar                                                        |