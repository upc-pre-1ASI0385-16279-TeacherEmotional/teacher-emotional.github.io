# US44.feature
# Epic: Sistema de Comunicación y Alertas de Riesgo (EP06)

Feature: Configuración de umbral de alerta (%)

  Como directivo
  Deseo definir el porcentaje de negatividad emocional (ej. 40%) que dispara una alerta
  Para personalizar la sensibilidad del monitoreo según la cultura de mi colegio

  Escenario: E01 - Configuración exitosa del umbral de alerta (flujo feliz)
  Dado que el directivo ha iniciado sesión en TeacherEmotional con privilegios de configuración
  Y se encuentra en la sección de ajustes de notificaciones (EP06), donde puede definir parámetros de alertas tempranas
  Cuando modifica el valor numérico del umbral de negatividad emocional (ej. cambia del 30% predeterminado al 40%) mediante un slider o campo numérico
  Y presiona el botón "Guardar cambios"
  Entonces el sistema valida que el valor esté en un rango permitido (ej. entre 10% y 90%)
  Y lo guarda en la base de datos
  Y actualiza la lógica de detección de alertas automáticas
  Y muestra un mensaje de éxito: "Umbral de alerta actualizado. Las notificaciones se enviarán cuando el porcentaje de emociones negativas supere el 40%."
  Y a partir de ese momento, el sistema solo emitirá alertas (ej. correo al directivo, notificación en dashboard) cuando los registros de estrés alto/malestar grupal superen dicho límite

  Escenario: E02 - Intento de configurar un umbral inválido (flujo alternativo)
  Dado que el directivo se encuentra en los ajustes de notificaciones
  Cuando intenta guardar un valor de umbral fuera del rango permitido (ej. 5% por debajo del mínimo o 95% por encima del máximo)
  O ingresa un valor no numérico (ej. texto o caracteres especiales)
  O deja el campo vacío
  Entonces el sistema no actualiza la configuración
  Y muestra un mensaje de error específico:
  - "El umbral debe ser un número entre 10% y 90%."
  - "Ingresa un valor numérico válido."
  - "El campo no puede estar vacío."
  Y el campo mantiene el valor anterior (válido) o se resalta en rojo
  Y se bloquea el guardado hasta que se corrija el dato
  Y no afecta la lógica de alertas previamente configurada

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Configuración exitosa        | Umbral guardado, mensaje de éxito, lógica de alertas actualizada                                      |
  | Valor fuera de rango         | Mensaje de error específico, campo mantiene valor anterior, guardado bloqueado                        |
  | Valor no numérico            | Mensaje de error específico, campo resaltado, guardado bloqueado                                      |
  | Campo vacío                  | Mensaje de error específico, guardado bloqueado                                                       |