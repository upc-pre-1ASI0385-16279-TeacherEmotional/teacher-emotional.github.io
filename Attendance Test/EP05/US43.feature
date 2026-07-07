# US43.feature
# Epic: Gestión de Estructura Institucional (EP05)

Feature: Edición de perfil de la institución

  Como directivo o administrador
  Deseo personalizar el nombre y logo de la web app
  Para que los docentes sientan que es una herramienta oficial y propia del colegio

  Escenario: E01 - Actualización exitosa del perfil institucional (flujo feliz)
  Dado que el administrador ha iniciado sesión en TeacherEmotional con privilegios
  Y se encuentra en la sección "Ajustes de Sistema" o "Perfil de la Institución"
  Cuando sube un archivo de imagen (Logo) en formato PNG, JPG o SVG (con tamaño máximo ej. 2MB)
  Y edita el texto del nombre del centro educativo (ej. cambia de "Colegio Ejemplo" a "Colegio Los Álamos")
  Y presiona el botón "Guardar cambios"
  Entonces el sistema valida el formato y tamaño de la imagen
  Y actualiza el nombre y el logo en la base de datos
  Y los cambios se aplican globalmente:
  - En el encabezado de todas las páginas de la web app (para todos los usuarios: docentes, coordinadores y directivos)
  - En los reportes exportados en PDF (US24) y Excel (US25), reemplazando el nombre y logo anteriores
  Y se muestra un mensaje de éxito: "Perfil de la institución actualizado correctamente."
  Y la interfaz refleja el nuevo logo y nombre inmediatamente sin necesidad de recargar la página

  Escenario: E02 - Error en la carga del logo o datos inválidos (flujo alternativo)
  Dado que el administrador se encuentra en "Ajustes de Sistema"
  Cuando intenta subir un archivo de imagen que no cumple con el formato requerido (ej. PDF, BMP, archivo corrupto)
  O excede el tamaño máximo (ej. más de 2MB)
  O intenta guardar un nombre de institución vacío o con caracteres no permitidos (ej. solo símbolos)
  Entonces el sistema no actualiza el perfil
  Y muestra un mensaje de error específico:
  - "El logo debe ser una imagen en formato PNG, JPG o SVG. Tamaño máximo 2MB."
  - "El nombre de la institución no puede estar vacío." o "Usa solo letras, números y caracteres básicos."
  Y los campos del formulario conservan los valores anteriores (el nombre anterior y el logo anterior no se modifican)
  Y el administrador puede corregir el error y volver a intentar la actualización

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Actualización exitosa        | Nombre y logo actualizados globalmente, mensaje de éxito, cambios visibles sin recargar              |
  | Formato de imagen inválido   | Mensaje de error específico, campos conservan valores anteriores                                     |
  | Tamaño de imagen excedido    | Mensaje de error específico, campos conservan valores anteriores                                     |
  | Nombre de institución vacío  | Mensaje de error específico, campos conservan valores anteriores                                     |
  | Caracteres no permitidos     | Mensaje de error específico, campos conservan valores anteriores                                     |