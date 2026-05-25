import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { LoginData, RegisterData } from '../../models/user.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-auth',
  imports: [FormsModule, NavbarComponent, RouterLink],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
/**
 * Controla login y registro local reutilizando las reglas de AuthService.
 */
export class AuthComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly currentUser = this.authService.currentUser;
  mode: 'login' | 'register' = 'login';
  message = '';
  messageType: 'error' | 'success' | '' = '';
  loginData: LoginData = {
    email: '',
    password: '',
  };
  registerData: RegisterData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  /**
   * Cambia entre login y registro limpiando mensajes de la vista.
   */
  showMode(mode: 'login' | 'register'): void {
    this.mode = mode;
    this.message = '';
    this.messageType = '';
  }

  /**
   * Inicia sesion y vuelve al catalogo cuando las credenciales son validas.
   */
  submitLogin(): void {
    const result = this.authService.loginUser(this.loginData.email, this.loginData.password);

    this.setFeedback(result.message, result.success);

    if (result.success) {
      this.router.navigateByUrl('/');
    }
  }

  /**
   * Registra un usuario y prepara el formulario de login tras un alta correcta.
   */
  submitRegister(): void {
    const result = this.authService.registerUser(this.registerData);

    this.setFeedback(result.message, result.success);

    if (!result.success) {
      return;
    }

    this.loginData = {
      email: this.registerData.email.trim().toLowerCase(),
      password: '',
    };
    this.registerData = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
    this.mode = 'login';
  }

  logout(): void {
    this.authService.logoutUser();
    this.setFeedback('Sesion cerrada.', true);
    this.mode = 'login';
  }

  private setFeedback(message: string, success: boolean): void {
    this.message = message;
    this.messageType = success ? 'success' : 'error';
  }
}
