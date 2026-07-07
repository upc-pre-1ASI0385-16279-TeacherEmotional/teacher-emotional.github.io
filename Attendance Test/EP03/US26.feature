# US26.feature
# Epic: Visualización Analítica para la Toma de Decisiones (EP03)

Feature: Visualización de "Nube de palabras" según notas de texto

  Como directivo
  Deseo ver una nube de palabras basada en los comentarios anónimos
  Para identificar los temas recurrentes que preocupan a los docentes

  Escenario: E01 - Visualización exitosa de la nube de palabras (flujo feliz)
  Dado que el directivo ha iniciado sesión en TeacherEmotional
  Y accede a la sección cualitativa del dashboard (ej. "Análisis de comentarios" o "Nube de palabras")
  Y ha seleccionado un período (ej. último mes)
  Cuando el sistema procesa automáticamente todos los comentarios anónimos (notas de texto opcionales) ingresados por los docentes en el período seleccionado
  Entonces muestra una nube de términos (word cloud) donde:
  - Cada palabra o frase corta (ej. "sobrecarga", "reuniones", "padres", "evaluaciones") aparece con un tamaño proporcional a su frecuencia de aparición en los comentarios
  - Las palabras más recurrentes se muestran en mayor tamaño y con colores más intensos
  - Se excluyen automáticamente palabras vacías (conjunciones, artículos, preposiciones como "y", "de", "la", "el")
  Y al hacer hover sobre una palabra, se muestra un tooltip con la frecuencia exacta (ej. "sobrecarga: 24 menciones")
  Y si el directivo hace clic, puede ver una lista de comentarios anónimos de muestra que contienen ese término

  Escenario: E02 - Sin comentarios o insuficientes para generar nube (flujo alternativo)
  Dado que el directivo accede a la sección cualitativa
  Cuando el sistema procesa los comentarios del período seleccionado
  Y no hay ningún comentario de texto (todos los docentes omitieron la nota opcional)
  O hay menos de 3 comentarios totales (o menos de 10 palabras significativas)
  Entonces el sistema no genera la nube de palabras
  Y muestra un mensaje informativo: "No hay suficientes comentarios de texto para generar una nube de palabras. Recuerda que los docentes pueden agregar notas opcionales en sus registros emocionales."
  Y puede mostrar un ejemplo ilustrativo o un estado "próximamente" con un diseño atractivo que invite a los docentes a escribir comentarios, sin mostrar datos vacíos

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Comentarios suficientes      | Nube de palabras con tamaños y colores según frecuencia, tooltips interactivos                        |
  | Sin comentarios o insuficientes | Mensaje informativo, opcionalmente muestra estado "próximamente" o ejemplo                           |