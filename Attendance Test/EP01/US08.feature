# US08.feature
# Epic: Gestión de Seguridad y Perfiles de Usuario (EP01)

Feature: Términos y condiciones de privacidad

  Como docente preocupado por la ética
  Deseo leer y aceptar las políticas de privacidad
  Para estar seguro de que mis datos emocionales se manejarán bajo estricto anonimato

  Escenario: E01 - Aceptación exitosa de términos
  Dado que el usuario (docente) está completando su perfil por primera vez en TeacherEmotional, antes de realizar su primer registro de emoción
  Cuando se le presenta el aviso de privacidad de datos con el texto completo de políticas (anonimato, uso de datos, derechos, etc.) y un enlace para leer los términos detallados
  Entonces el usuario debe marcar activamente la casilla de aceptación que dice "Acepto las políticas de privacidad y el tratamiento anónimo de mis datos emocionales"
  Y solo después de marcarla, el sistema habilita el botón de "Continuar" o "Registrar emoción"
  Y permite al usuario avanzar y usar la funcionalidad principal de la aplicación

  Escenario: E02 - Rechazo o no aceptación de términos
  Dado que el usuario está completando su perfil por primera vez y se le presenta el aviso de privacidad de datos
  Cuando el usuario no marca la casilla de aceptación (deja el checkbox vacío)
  Y intenta hacer clic en el botón "Continuar" o "Registrar emoción"
  Entonces el sistema no permite avanzar
  Y muestra un mensaje de advertencia: "Debes aceptar las políticas de privacidad para continuar usando la plataforma"
  Y el botón permanece deshabilitado hasta que el usuario marque la casilla de aceptación
  Y garantiza el consentimiento explícito antes de cualquier registro de datos sensibles

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Aceptación marcada           | Botón "Continuar" o "Registrar emoción" se habilita, el usuario puede avanzar                        |
  | Aceptación no marcada        | Botón deshabilitado, muestra mensaje de advertencia: "Debes aceptar las políticas de privacidad..."   |
  | Consentimiento explícito     | No se permite el registro de emociones sin la aceptación previa                                      |