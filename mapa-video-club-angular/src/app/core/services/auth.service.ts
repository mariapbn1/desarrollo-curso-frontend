import { Injectable, signal } from '@angular/core';

import { AuthResult, RegisterData, SessionUser, User } from '../../models/user.model';

const STORAGE_KEYS = {
  users: 'mapaVideoClubUsers',
  session: 'mapaVideoClubSession',
} as const;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly currentUserSignal = signal<SessionUser | null>(
    this.readStorage<SessionUser | null>(STORAGE_KEYS.session, null),
  );
  readonly currentUser = this.currentUserSignal.asReadonly();

  getUsers(): User[] {
    const users = this.readStorage<User[]>(STORAGE_KEYS.users, []);

    return Array.isArray(users) ? users : [];
  }

  registerUser(userData: RegisterData): AuthResult {
    const name = String(userData.name || '').trim();
    const email = this.normalizeEmail(userData.email);
    const password = String(userData.password || '');
    const confirmPassword = String(userData.confirmPassword || '');

    if (!name || !email || !password || !confirmPassword) {
      return { success: false, message: 'Completa todos los campos.' };
    }

    if (!this.isValidEmail(email)) {
      return { success: false, message: 'Ingresa un correo valido.' };
    }

    if (password.length < 6) {
      return { success: false, message: 'La contrasena debe tener al menos 6 caracteres.' };
    }

    if (password !== confirmPassword) {
      return { success: false, message: 'Las contrasenas no coinciden.' };
    }

    const users = this.getUsers();
    const emailExists = users.some((user) => this.normalizeEmail(user.email) === email);

    if (emailExists) {
      return { success: false, message: 'Este usuario ya está registrado.' };
    }

    const user: User = {
      id: String(Date.now()),
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
    };

    if (!this.writeStorage(STORAGE_KEYS.users, [...users, user])) {
      return { success: false, message: 'No fue posible guardar el usuario.' };
    }

    return { success: true, message: 'Registro exitoso. Ya puedes iniciar sesion.' };
  }

  loginUser(email: string, password: string): AuthResult {
    const normalizedEmail = this.normalizeEmail(email);
    const cleanPassword = String(password || '');

    if (!normalizedEmail || !cleanPassword) {
      return { success: false, message: 'Completa correo y contrasena.' };
    }

    if (!this.isValidEmail(normalizedEmail)) {
      return { success: false, message: 'Ingresa un correo valido.' };
    }

    const user = this.getUsers().find(
      (savedUser) =>
        this.normalizeEmail(savedUser.email) === normalizedEmail &&
        savedUser.password === cleanPassword,
    );

    if (!user) {
      return { success: false, message: 'Correo o contrasena incorrectos.' };
    }

    const sessionUser: SessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    if (!this.writeStorage(STORAGE_KEYS.session, sessionUser)) {
      return { success: false, message: 'No fue posible iniciar sesion.' };
    }

    this.currentUserSignal.set(sessionUser);

    return { success: true, message: 'Sesion iniciada.', user: sessionUser };
  }

  logoutUser(): void {
    this.removeStorage(STORAGE_KEYS.session);
    this.currentUserSignal.set(null);
  }

  getCurrentUser(): SessionUser | null {
    return this.currentUserSignal();
  }

  isAuthenticated(): boolean {
    return this.currentUserSignal() !== null;
  }

  setCurrentUser(user: SessionUser | User): void {
    const sessionUser: SessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    this.writeStorage(STORAGE_KEYS.session, sessionUser);
    this.currentUserSignal.set(sessionUser);
  }

  clearSession(): void {
    this.logoutUser();
  }

  private normalizeEmail(email: string): string {
    return String(email || '').trim().toLowerCase();
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private readStorage<T>(key: string, fallbackValue: T): T {
    const storage = this.getStorage();

    if (!storage) {
      return fallbackValue;
    }

    try {
      const rawValue = storage.getItem(key);

      return rawValue ? (JSON.parse(rawValue) as T) : fallbackValue;
    } catch {
      return fallbackValue;
    }
  }

  private writeStorage(key: string, value: unknown): boolean {
    const storage = this.getStorage();

    if (!storage) {
      return false;
    }

    try {
      storage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  private removeStorage(key: string): void {
    const storage = this.getStorage();

    storage?.removeItem(key);
  }

  private getStorage(): Storage | null {
    try {
      return globalThis.localStorage ?? null;
    } catch {
      return null;
    }
  }
}
