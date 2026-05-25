import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { FavoriteService } from './favorite.service';

describe('FavoriteService', () => {
  let authService: AuthService;
  let service: FavoriteService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    authService = TestBed.inject(AuthService);
    service = TestBed.inject(FavoriteService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return empty favorites without active user', () => {
    expect(service.getFavorites()).toEqual([]);
    expect(service.isFavorite(1)).toBe(false);
  });

  it('should add favorite for active user', () => {
    authService.setCurrentUser({ id: '1', name: 'Laura', email: 'LAURA@MAIL.COM' });

    const result = service.addFavorite(1);

    expect(result.success).toBe(true);
    expect(service.getFavorites()).toEqual([1]);
    expect(service.isFavorite(1)).toBe(true);
  });

  it('should not duplicate favorites', () => {
    authService.setCurrentUser({ id: '1', name: 'Laura', email: 'laura@mail.com' });

    service.addFavorite(1);
    service.addFavorite('1');

    expect(service.getFavorites()).toEqual([1]);
  });

  it('should remove favorite', () => {
    authService.setCurrentUser({ id: '1', name: 'Laura', email: 'laura@mail.com' });

    service.addFavorite(1);
    service.removeFavorite(1);

    expect(service.getFavorites()).toEqual([]);
    expect(service.isFavorite(1)).toBe(false);
  });

  it('should not mix favorites between users', () => {
    authService.setCurrentUser({ id: '1', name: 'Laura', email: 'laura@mail.com' });
    service.addFavorite(1);

    authService.setCurrentUser({ id: '2', name: 'Diego', email: 'diego@mail.com' });
    service.addFavorite(2);

    expect(service.getFavorites()).toEqual([2]);

    authService.setCurrentUser({ id: '1', name: 'Laura', email: 'laura@mail.com' });

    expect(service.getFavorites()).toEqual([1]);
  });
});
