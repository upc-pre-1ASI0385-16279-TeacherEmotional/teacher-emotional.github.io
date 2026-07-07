# US27.feature
# Epic: Visualización Analítica para la Toma de Decisiones (EP03)

Feature: Indicador de tasa de participación de docentes

  Como directivo
  Deseo conocer qué porcentaje de la plana docente está usando la app diariamente
  Para validar la representatividad de los datos obtenidos

  Escenario: E01 - Visualización exitosa de la tasa de participación (flujo feliz)
  Dado que el directivo ha iniciado sesión en TeacherEmotional
  Y abre el dashboard diario (vista principal de analítica)
  Cuando se cargan las métricas principales del día actual (o del día seleccionado en el calendario)
  Entonces el sistema muestra un indicador destacado (ej. una tarjeta o medidor circular) con el porcentaje de participación
  Calculado como: (Número de docentes que han registrado al menos una emoción hoy) / (Número total de docentes activos en la institución) × 100
  Y se muestra textualmente, por ejemplo: "Participación de hoy: 68% (34 de 50 docentes)"
  Y se muestra un ícono que representa representatividad:
  - ✅ "Buen nivel" si ≥70%
  - ⚠️ "Participación moderada" si 40-69%
  - ❌ "Baja representatividad" si <40%
  Y debajo del porcentaje puede aparecer una frase de contexto: "Los datos reflejan la opinión de la mayoría del equipo."

  Escenario: E02 - Participación baja o nula (flujo alternativo)
  Dado que el directivo abre el dashboard diario
  Cuando se cargan las métricas y la tasa de participación es menor al 30% (ej. 15% o 0%)
  Debido a que pocos o ningún docente ha registrado su emoción en el día
  Entonces el sistema muestra el indicador con el porcentaje correspondiente
  Y muestra un color de advertencia (amarillo o rojo)
  Y muestra un mensaje claro: "Participación baja (15%). Los datos pueden no ser representativos del clima laboral general. Te recomendamos fomentar el registro diario entre tus docentes."
  Y se puede incluir un botón o enlace a "Consejos para mejorar la participación"
  Que redirija a una guía o sección de buenas prácticas dentro de la plataforma
  Sin ocultar la métrica (la transparencia es clave incluso cuando el dato es malo)

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Participación alta (≥70%)    | Indicador con ✅ "Buen nivel", frase de contexto                                                     |
  | Participación moderada (40-69%) | Indicador con ⚠️ "Participación moderada"                                                           |
  | Participación baja (<40%)    | Indicador con ❌ "Baja representatividad", mensaje de advertencia                                    |
  | Participación muy baja (<30%)| Color de advertencia (amarillo/rojo), mensaje claro, enlace a consejos                              |