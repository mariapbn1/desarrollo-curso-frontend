export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt?: string;
}

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

export interface AuthResult {
  success: boolean;
  message: string;
  user?: SessionUser;
}
