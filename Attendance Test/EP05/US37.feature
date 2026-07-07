# US37.feature
# Epic: Gestión de Estructura Institucional (EP05)

Feature: Carga masiva de docentes vía CSV/Excel

  Como administrador
  Deseo subir un archivo con la lista de todo el personal
  Para ahorrar tiempo en la configuración inicial de la plataforma

  Escenario: E01 - Carga masiva exitosa con archivo válido (flujo feliz)
  Dado que el administrador ha iniciado sesión en TeacherEmotional
  Y se encuentra en el módulo de "Gestión de Usuarios" (EP05)
  Y dispone de un archivo CSV o Excel con el formato requerido (columnas: nombre, correo, DNI, nivel educativo, departamento – opcional)
  Cuando selecciona el archivo desde su ordenador mediante el botón "Subir archivo"
  Y presiona el botón "Cargar"
  Y el sistema comienza a procesar la lista
  Entonces el sistema valida el formato y los datos
  Y crea todas las cuentas en lote (asignando rol "docente" y generando contraseñas temporales individuales)
  Y envía correos automáticos a cada docente con sus credenciales
  Y muestra un reporte de resultados indicando: "Carga completada. X registros exitosos, Y errores." (ej. 45 exitosos, 3 errores por correos duplicados o formato inválido)
  Y se ofrece un botón para descargar el detalle de errores (archivo con filas problemáticas) para que el administrador los corrija y reintente

  Escenario: E02 - Archivo con formato incorrecto o vacío (flujo alternativo)
  Dado que el administrador se encuentra en el módulo de carga masiva
  Cuando selecciona un archivo que no tiene el formato esperado (ej. CSV con columnas diferentes a las requeridas, archivo vacío, archivo corrupto o extensión no soportada)
  O el archivo está correcto pero no contiene filas de datos (solo encabezados)
  Entonces el sistema no procesa el archivo
  Y muestra un mensaje de error claro: "El archivo no tiene el formato válido. Asegúrate de usar las columnas: nombre, correo, DNI (y opcionalmente nivel, departamento). Descarga la plantilla de ejemplo."
  Y se mantiene visible la opción de descargar una plantilla CSV/Excel de ejemplo
  Y no se crea ninguna cuenta hasta que se suba un archivo válido

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Carga masiva exitosa         | Cuentas creadas en lote, correos enviados, reporte de resultados con exitosos y errores               |
  | Formato incorrecto           | Mensaje de error, opción de descargar plantilla, sin creación de cuentas                              |
  | Archivo vacío                | Mensaje de error, sin creación de cuentas                                                             |