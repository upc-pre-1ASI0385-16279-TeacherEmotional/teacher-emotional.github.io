# US31.feature
# Epic: Biblioteca de Bienestar y Soporte Preventivo (EP04)

Feature: Buscador de recursos por palabra clave

  Como docente
  Deseo buscar contenido ingresando términos específicos (ej. "sueño")
  Para encontrar rápidamente ayuda relacionada con mi malestar actual

  Escenario: E01 - Búsqueda exitosa con resultados coincidentes (flujo feliz)
  Dado que el docente ha iniciado sesión en TeacherEmotional
  Y se encuentra en la biblioteca de recursos (sección de bienestar con audios, videos y artículos)
  Cuando escribe una palabra clave en la barra de búsqueda (ej. "sueño", "ansiedad", "estiramiento")
  Y el sistema aplica el filtro en tiempo real mientras escribe (búsqueda incremental) o tras presionar "Buscar" o Enter
  Entonces el sistema filtra y muestra únicamente los recursos (audios, videos, artículos) cuyo título o descripción contengan el término ingresado
  Y los ordena por relevancia (ej. mayor coincidencia en título primero)
  Y se muestra un contador con el número de resultados encontrados (ej. "3 recursos encontrados")
  Y si no hay coincidencias, se muestra un mensaje: "No se encontraron recursos para tu búsqueda. Prueba con otra palabra clave."

  Escenario: E02 - Búsqueda con términos sin resultados o barra vacía (flujo alternativo)
  Dado que el docente se encuentra en la biblioteca de recursos
  Cuando escribe un término que no coincide con ningún título o descripción de los recursos disponibles (ej. "matemáticas" si no hay contenido relacionado)
  Entonces el sistema muestra un mensaje claro en el área de resultados: "No hay recursos que coincidan con tu búsqueda. Prueba con otra palabra como 'estrés', 'respiración' o 'pausa'." (sugiriendo términos alternativos populares)
  Y cuando la barra queda vacía, el sistema restaura automáticamente la lista completa de recursos (sin filtro), mostrando todos los elementos disponibles nuevamente

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Búsqueda con resultados      | Muestra recursos filtrados, contador de resultados, ordenados por relevancia                          |
  | Búsqueda sin resultados      | Mensaje con sugerencias de términos alternativos, sin recursos visibles                               |
  | Barra de búsqueda vacía      | Restaura la lista completa de recursos automáticamente                                               |