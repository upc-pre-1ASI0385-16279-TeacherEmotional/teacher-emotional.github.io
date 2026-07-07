# US04.feature
# Epic: Gestión de Seguridad y Perfiles de Usuario (EP01)

Feature: Validación de fortaleza de contraseña

  Como usuario nuevo
  Deseo recibir retroalimentación sobre la seguridad de mi clave
  Para asegurarme de que mi cuenta esté protegida contra ataques simples

  Escenario: E01 - Contraseña débil o que no cumple requisitos
  Dado que el usuario nuevo se encuentra en el formulario de registro de TeacherEmotional
  Y está escribiendo una nueva contraseña en el campo correspondiente
  Cuando la clave ingresada no cumple con los requisitos mínimos de seguridad (mínimo 8 caracteres, al menos un número y al menos un símbolo especial como !@#$%^&*)
  Entonces el sistema muestra un indicador visual en color rojo (ej. texto "Débil" o "No cumple requisitos")
  Y muestra una lista de requisitos faltantes (ej. "Falta un símbolo", "Mínimo 8 caracteres")
  Y el botón de "Registrarme" o "Crear cuenta" permanece deshabilitado (gris e inactivo) hasta que la contraseña cumpla con todos los requisitos mínimos

  Escenario: E02 - Contraseña segura que cumple requisitos
  Dado que el usuario nuevo se encuentra en el formulario de registro
  Cuando la clave ingresada cumple con todos los requisitos mínimos de seguridad (8+ caracteres, contiene al menos un número y un símbolo especial)
  Entonces el sistema muestra un indicador visual en color verde (ej. "Fuerte" o "Válida")
  Y desaparece la lista de advertencias
  Y el botón de "Registrarme" se habilita automáticamente (cambia a color activo), permitiendo al usuario continuar con el registro

  Examples: Datos de salida esperados
  | Elemento                     | Resultado esperado                                                                                    |
  | Contraseña débil             | Indicador rojo, lista de requisitos faltantes, botón deshabilitado                                    |
  | Contraseña segura            | Indicador verde, sin advertencias, botón habilitado                                                   |