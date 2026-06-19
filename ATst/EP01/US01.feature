Feature: Inicio de sesión básico

  Como usuario registrado
  Deseo ingresar mis credenciales de acceso 
  Para entrar de forma segura a mi panel de control personal

  Escenario: E01 - Inicio de sesión exitoso
    Dado que el usuario registrado se encuentra en la página de login de "TeacherEmotional"
    Cuando ingresa su correo electrónico válido y su contraseña correcta
    Y presiona el botón "Ingresar"
    Entonces el sistema autentica las credenciales, otorga acceso y redirige al usuario al panel de control (dashboard) correspondiente a su rol
    Y se muestran sus datos y opciones principales en la interfaz del panel de control

  Escenario: E02 - Credenciales inválidas
    Dado que el usuario se encuentra en la página de login
    Cuando ingresa un correo electrónico no registrado o una contraseña incorrecta
    Y presiona el botón "Ingresar"
    Entonces el sistema muestra un mensaje claro de error: "Correo o contraseña incorrectos. Por favor, inténtalo de nuevo."
    Y el usuario permanece en la misma página de inicio de sesión sin acceder al sistema
    Análogamente los campos de credenciales se mantienen para que pueda corregirlos

  Examples: Datos de salida esperados
    | Elemento                     | Resultado esperado                                                                    |
    | Inicio de sesión exitoso     | Direcciona al usuario al panel de control e interfaz correspondiente                  |
    | Mensaje de error             | Muestra "Correo o contraseña incorrectos. Por favor, inténtalo de nuevo"               |
    | Permanencia en pantalla      | El usuario seguirá en la pantalla de inicio de sesión con los campos mantenidos        |