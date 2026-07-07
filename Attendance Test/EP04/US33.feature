# US33.feature
# Epic: Biblioteca de Bienestar y Soporte Preventivo (EP04)

Feature: Marcador de "Recursos favoritos"

  Como docente
  Deseo guardar los contenidos que más me gustan
  Para acceder a ellos de forma directa en el futuro sin tener que buscarlos nuevamente

  Escenario: E01 - Agregar un recurso a favoritos (flujo feliz)
  Dado que el docente ha iniciado sesión en TeacherEmotional
  Y se encuentra visualizando un recurso de bienestar (audio, video o artículo) en la galería o en su vista detalle
  Cuando hace clic en el icono de "Corazón" ❤️ o "Estrella" ⭐ (vacío inicialmente) que representa "Agregar a favoritos"
  Entonces el sistema cambia el estado del icono a relleno o coloreado (ej. corazón rojo)
  Y añade dicho elemento automáticamente a la sección personalizada de "Mis Favoritos" dentro del perfil del docente
  Y se muestra un breve mensaje de confirmación (toast o tooltip): "Recurso guardado en Favoritos"
  Y el docente puede acceder después a esa sección para ver todos sus recursos marcados

  Escenario: E02 - Quitar un recurso de favoritos (flujo alternativo - desmarcar)
  Dado que el docente está visualizando un recurso que ya había marcado como favorito anteriormente
  Y el icono aparece relleno/coloreado
  Cuando hace clic nuevamente en el mismo icono de "Corazón" o "Estrella"
  Entonces el sistema cambia el icono a vacío (sin relleno)
  Y elimina ese recurso de la sección "Mis Favoritos" del docente
  Y muestra un mensaje de confirmación: "Recurso eliminado de Favoritos"
  Y si el docente estaba dentro de la sección "Mis Favoritos" y elimina uno, el recurso desaparece de la lista en tiempo real sin necesidad de recargar la página

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Agregar a favoritos          | Icono se colorea/rellena, recurso añadido a "Mis Favoritos", mensaje de confirmación                 |
  | Quitar de favoritos          | Icono se vacía, recurso eliminado de "Mis Favoritos", mensaje de confirmación, actualización en tiempo real |