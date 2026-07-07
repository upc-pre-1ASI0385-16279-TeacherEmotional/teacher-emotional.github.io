# US07.feature
# Epic: Gestión de Seguridad y Perfiles de Usuario (EP01)

Feature: Persistencia de sesión ("Recordarme")

  Como usuario frecuente
  Deseo que el sistema mantenga mi sesión activa en mi dispositivo personal
  Para no tener que ingresar mis datos cada vez que abra el navegador

  Escenario: E01 - Sesión persistente exitosa
  Dado que el usuario se encuentra en el formulario de login de TeacherEmotional en su dispositivo personal
  Cuando marca la casilla "Recordarme"
  Y ingresa sus credenciales válidas (correo y contraseña)
  Y presiona el botón "Ingresar"
  Entonces el sistema autentica al usuario e inicia sesión correctamente
  Y guarda una cookie o token de sesión prolongada (ej. con duración de 30 días o hasta cierre explícito de sesión)
  Y al cerrar la pestaña o el navegador y volver a abrir la aplicación dentro del período de validez
  Entonces el usuario permanece autenticado y accede directamente a su dashboard sin necesidad de volver a ingresar sus credenciales

  Escenario: E02 - Sesión no persistente
  Dado que el usuario se encuentra en el formulario de login
  Cuando no marca la casilla "Recordarme"
  Y ingresa credenciales válidas e inicia sesión
  Entonces el sistema guarda una cookie o token de sesión de corta duración (ej. que expira al cerrar el navegador o tras 30 minutos de inactividad)
  Y al cerrar la pestaña o el navegador, la sesión se destruye automáticamente
  Y el usuario debe volver a ingresar sus credenciales en el próximo acceso, garantizando mayor seguridad en dispositivos compartidos o públicos

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Sesión con "Recordarme"      | Token persistente, al reabrir el navegador el usuario sigue autenticado                              |
  | Sesión sin "Recordarme"      | Token de corta duración, al cerrar el navegador se pierde la sesión                                 |
  | Comportamiento en público    | Sesión no persistente para mayor seguridad en dispositivos compartidos                              |