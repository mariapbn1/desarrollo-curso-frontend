import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a new user', () => {
    const result = service.registerUser({
      name: 'Laura',
      email: 'LAURA@MAIL.COM ',
      password: 'secreta1',
      confirmPassword: 'secreta1',
    });

    expect(result.success).toBe(true);
    expect(service.getUsers()).toEqual([
      expect.objectContaining({
        name: 'Laura',
        email: 'laura@mail.com',
      }),
    ]);
  });

  it('should block duplicate emails', () => {
    const userData = {
      name: 'Laura',
      email: 'laura@mail.com',
      password: 'secreta1',
      confirmPassword: 'secreta1',
    };

    service.registerUser(userData);
    const result = service.registerUser({ ...userData, name: 'Otra Laura' });

    expect(result.success).toBe(false);
    expect(result.message).toBe('Este usuario ya está registrado.');
  });

  it('should login with valid credentials', () => {
    service.registerUser({
      name: 'Laura',
      email: 'laura@mail.com',
      password: 'secreta1',
      confirmPassword: 'secreta1',
    });

    const result = service.loginUser(' LAURA@MAIL.COM ', 'secreta1');

    expect(result.success).toBe(true);
    expect(service.getCurrentUser()?.email).toBe('laura@mail.com');
  });

  it('should reject invalid credentials', () => {
    service.registerUser({
      name: 'Laura',
      email: 'laura@mail.com',
      password: 'secreta1',
      confirmPassword: 'secreta1',
    });

    const result = service.loginUser('laura@mail.com', 'incorrecta');

    expect(result.success).toBe(false);
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should clear the active session on logout', () => {
    service.registerUser({
      name: 'Laura',
      email: 'laura@mail.com',
      password: 'secreta1',
      confirmPassword: 'secreta1',
    });
    service.loginUser('laura@mail.com', 'secreta1');

    service.logoutUser();

    expect(service.getCurrentUser()).toBeNull();
    expect(localStorage.getItem('mapaVideoClubSession')).toBeNull();
  });
});
