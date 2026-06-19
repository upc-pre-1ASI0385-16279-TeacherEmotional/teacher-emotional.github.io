Feature: Creación y edición de departamentos

  Como administrador
  Deseo definir las áreas académicas del colegio
  Para que los reportes emocionales reflejen la estructura real de la institución.

  Escenario: E01 - Creación exitosa de un nuevo departamento (flujo feliz)
    Dado que el administrador ha iniciado sesión en "TeacherEmotional" y se encuentra en la sección de configuración de "Estructura"
    Cuando añade un nuevo nombre de departamento en el campo de texto y presiona el botón "Guardar"
    Entonces el sistema valida que el nombre no esté duplicado y lo guarda en la base de datos
    Y habilita automáticamente esa categoría para la asignación de docentes y filtros de reportes en la plataforma
    Y muestra el mensaje de éxito: "Departamento 'Matemáticas' creado correctamente." apareciendo en la lista visible

  Escenario: E02 - Intento de crear un departamento duplicado o nombre inválido (flujo alternativo)
    Dado que el administrador se encuentra en la configuración de "Estructura"
    Cuando intenta añadir un departamento con un nombre que ya existe, con caracteres no permitidos o deja el campo vacío
    Y presiona el botón "Guardar"
    Entonces el sistema no crea el nuevo departamento y muestra un mensaje de error específico según la validación fallida
    Y el campo de texto conserva el valor ingresado para que el administrador pueda corregirlo

  Escenario: E03 - Edición o eliminación de un departamento (adicional opcional)
    Dado que el administrador está en la lista de departamentos existentes
    Cuando selecciona un departamento y elige la opción de editar su nombre o eliminarlo permanentemente
    Entonces el sistema permite modificar el nombre siguiendo las reglas de unicidad o lo elimina actualizando los filtros y reportes
    Y si se intenta eliminar un departamento con docentes activos asignados, bloquea la acción mostrando una advertencia

  Examples: Datos de salida esperados
    | Elemento                     | Resultado esperado                                                                                       |
    | Creación exitosa             | Se guarda en la base de datos, habilita la categoría y muestra "Departamento 'Matemáticas' creado correctamente." |
    | Nombre duplicado             | Muestra el mensaje: "Ya existe un departamento con este nombre. Usa un nombre diferente."                |
    | Campo vacío                  | Muestra el mensaje: "El nombre del departamento no puede estar vacío."                                    |
    | Caracteres inválidos         | Muestra el mensaje: "Usa solo letras, números y espacios para el nombre del departamento."                |
    | Eliminación con docentes     | Muestra el mensaje: "No se puede eliminar el departamento porque tiene docentes asignados. Reasigna o desactiva esos docentes primero." |