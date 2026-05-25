/**
 * Usuario persistido localmente; la contrasena solo se usa en esta simulacion sin backend.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt?: string;
}

/**
 * Datos minimos de sesion que consumen navbar, favoritas y checkout.
 */
export interface SessionUser {
  id: string;
  name: string;
  email: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  name: string;
  confirmPassword: string;
}

/**
 * Resultado comun para login y registro con mensaje listo para la vista.
 */
export interface AuthResult {
  success: boolean;
  message: string;
  user?: SessionUser;
}
