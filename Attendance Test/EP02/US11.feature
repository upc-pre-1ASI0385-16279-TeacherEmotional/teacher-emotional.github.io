# US11.feature
# Epic: Interfaz de Captura de Bienestar (EP02)

Feature: Etiquetas de "causa de estrés"

  Como docente
  Deseo seleccionar etiquetas predefinidas
  Para identificar la fuente de mi malestar sin necesidad de escribir un texto largo

  Escenario: E01 - Selección de una o más etiquetas
  Dado que el docente ha seleccionado un emoji que representa un nivel de estrés alto (ej. 😢 Muy mal o 😕 Mal) en la pantalla de registro emocional de TeacherEmotional
  Cuando marca una o más etiquetas de la lista de causas comunes (ej. "Sobrecarga de horas", "Conductas disruptivas en aula", "Falta de recursos", "Presión por evaluaciones")
  Entonces el sistema categoriza internamente el registro asociando esas etiquetas a la emoción reportada
  Y permite que en el dashboard del directivo se visualicen tendencias grupales anónimas sobre las causas de estrés más frecuentes
  Y el docente puede continuar y guardar el registro completo (emoji + etiquetas + nota opcional)

  Escenario: E02 - Omisión de etiquetas cuando el nivel de estrés es bajo
  Dado que el docente ha seleccionado un emoji que representa un nivel de estrés bajo o neutro (ej. 😐 Normal, 🙂 Bien, 😄 Muy bien)
  Cuando el sistema no muestra o deja opcional la sección de "causas de estrés" (o la muestra deshabilitada)
  Entonces el docente puede guardar el registro sin necesidad de seleccionar ninguna etiqueta
  Y las causas de estrés solo son relevantes para reportes de malestar significativo
  Y el sistema no fuerza la selección de etiquetas en estos casos, simplificando la experiencia para emociones positivas

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Emoción negativa con etiqueta| Se categoriza internamente, se visualizan tendencias grupales anónimas en el dashboard del directivo |
  | Emoción negativa sin etiqueta| No se fuerza la selección (opcional), se puede guardar el registro                                   |
  | Emoción positiva             | La sección de etiquetas no se muestra o está deshabilitada, el registro se guarda sin problemas       |