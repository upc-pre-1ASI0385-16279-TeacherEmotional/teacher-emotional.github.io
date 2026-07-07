  # US48.feature
# Epic: Sistema de Comunicación y Alertas de Riesgo (EP06)

Feature: Botón de SOS

  Como docente en una crisis emocional severa
  Deseo presionar un botón de auxilio directo
  Para que el departamento de psicología me contacte prioritariamente

  Escenario: E01 - Activación exitosa del botón SOS (flujo feliz)
  Dado que el docente ha iniciado sesión en TeacherEmotional
  Y se encuentra en su panel de inicio (dashboard personal)
  Y está experimentando una crisis emocional severa
  Cuando presiona el botón "Solicitar Ayuda" (o botón SOS, con diseño distintivo en rojo)
  Entonces aparece una ventana emergente de confirmación con el mensaje: "¿Estás seguro de que deseas solicitar ayuda psicológica? Un profesional se comunicará contigo a la brevedad."
  Y el docente hace clic en "Sí, enviar alerta"
  Entonces el sistema envía una alerta inmediata (prioridad alta) que contiene los datos básicos del docente (nombre, cargo, número de teléfono de contacto y, si está disponible, su ubicación dentro del colegio)
  Y la alerta se envía al panel del directivo (con un banner rojo destacado) y al correo/panel del psicólogo asignado a la institución
  Y se muestra un mensaje de confirmación al docente: "Solicitud de ayuda enviada. Un psicólogo se pondrá en contacto contigo lo antes posible. Recuerda que tu bienestar es lo más importante."
  Y el botón SOS se deshabilita temporalmente (por ej. por 10 minutos) para evitar envíos múltiples accidentales

  Escenario: E02 - Cancelación de la alerta o error técnico (flujo alternativo)
  Dado que el docente presiona el botón "Solicitar Ayuda" y aparece la ventana emergente de confirmación
  Cuando el docente selecciona "Cancelar" en lugar de confirmar
  O ocurre un error técnico durante el envío de la alerta (ej. pérdida de conexión a internet, servidor no responde, fallo en el servicio de correo/notificaciones)
  Entonces el sistema no envía ninguna alerta al directivo ni al psicólogo en caso de cancelación
  Y en caso de error técnico, se muestra un mensaje de error claro al docente: "No se pudo enviar tu solicitud. Verifica tu conexión a internet o intenta de nuevo en unos segundos."
  Y el docente puede reintentar el envío presionando nuevamente el botón SOS (no se deshabilita si hubo error)
  Y se registra en los logs internos el intento fallido (para auditoría y monitoreo de la funcionalidad), pero sin generar falsas alarmas a los profesionales