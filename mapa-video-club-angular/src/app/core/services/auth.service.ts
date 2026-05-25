import { Injectable, signal } from '@angular/core';

import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly currentUser = signal<User | null>(null);

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  setCurrentUser(user: User): void {
    this.currentUser.set(user);
  }

  clearSession(): void {
    this.currentUser.set(null);
  }
}
