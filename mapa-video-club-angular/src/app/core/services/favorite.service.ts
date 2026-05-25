import { computed, inject, Injectable, signal } from '@angular/core';

import { AuthService } from './auth.service';

type FavoriteMovieId = number | string;
type FavoritesMap = Record<string, FavoriteMovieId[]>;

export interface FavoriteResult {
  success: boolean;
  message: string;
  favorites: readonly FavoriteMovieId[];
  isFavorite: boolean;
}

const STORAGE_KEY = 'mapaVideoClubFavorites';

@Injectable({
  providedIn: 'root',
})
/**
 * Mantiene favoritas separadas por correo del usuario activo.
 */
export class FavoriteService {
  private readonly authService = inject(AuthService);
  private readonly favoritesMap = signal<FavoritesMap>(this.readFavoritesMap());
  private readonly currentFavorites = computed(() => {
    const email = this.getCurrentUserEmail();

    return email ? this.normalizeFavoriteList(this.favoritesMap()[email] ?? []) : [];
  });

  /**
   * Devuelve las favoritas del usuario autenticado; sin sesion retorna lista vacia.
   */
  getFavorites(): readonly FavoriteMovieId[] {
    return [...this.currentFavorites()];
  }

  getFavoriteMovieIds(): readonly string[] {
    return this.getFavorites().map((movieId) => String(movieId));
  }

  /**
   * Consulta si una pelicula pertenece a la lista del usuario actual.
   */
  isFavorite(movieId: FavoriteMovieId): boolean {
    const normalizedMovieId = this.normalizeMovieId(movieId);

    return this.currentFavorites().some(
      (favoriteMovieId) => this.normalizeMovieId(favoriteMovieId) === normalizedMovieId,
    );
  }

  /**
   * Alterna favorita y bloquea la accion cuando no existe sesion activa.
   */
  toggleFavorite(movieId: FavoriteMovieId): FavoriteResult {
    const email = this.getCurrentUserEmail();

    if (!email) {
      return this.createResult(false, 'Inicia sesion para guardar favoritas.', movieId);
    }

    return this.isFavorite(movieId) ? this.removeFavorite(movieId) : this.addFavorite(movieId);
  }

  /**
   * Agrega una favorita sin duplicar ids dentro del usuario actual.
   */
  addFavorite(movieId: FavoriteMovieId): FavoriteResult {
    const email = this.getCurrentUserEmail();

    if (!email) {
      return this.createResult(false, 'Inicia sesion para guardar favoritas.', movieId);
    }

    if (this.isFavorite(movieId)) {
      return this.createResult(true, 'La pelicula ya esta en favoritas.', movieId);
    }

    return this.updateFavorites(email, [...this.currentFavorites(), this.serializeMovieId(movieId)], movieId);
  }

  /**
   * Quita una pelicula solo de la lista del usuario autenticado.
   */
  removeFavorite(movieId: FavoriteMovieId): FavoriteResult {
    const email = this.getCurrentUserEmail();

    if (!email) {
      return this.createResult(false, 'Inicia sesion para guardar favoritas.', movieId);
    }

    const normalizedMovieId = this.normalizeMovieId(movieId);
    const nextFavorites = this.currentFavorites().filter(
      (favoriteMovieId) => this.normalizeMovieId(favoriteMovieId) !== normalizedMovieId,
    );

    return this.updateFavorites(email, nextFavorites, movieId);
  }

  /**
   * Limpia todas las favoritas del usuario activo sin afectar a otros usuarios.
   */
  clearFavoritesForCurrentUser(): FavoriteResult {
    const email = this.getCurrentUserEmail();

    if (!email) {
      return this.createResult(false, 'Inicia sesion para guardar favoritas.');
    }

    return this.updateFavorites(email, []);
  }

  private updateFavorites(
    email: string,
    nextFavorites: readonly FavoriteMovieId[],
    movieId?: FavoriteMovieId,
  ): FavoriteResult {
    const favoritesMap = {
      ...this.favoritesMap(),
      [email]: this.normalizeFavoriteList(nextFavorites),
    };

    if (!this.writeFavoritesMap(favoritesMap)) {
      return this.createResult(false, 'No fue posible guardar favoritas.', movieId);
    }

    this.favoritesMap.set(favoritesMap);

    return this.createResult(true, 'Favoritas actualizadas.', movieId);
  }

  private createResult(success: boolean, message: string, movieId?: FavoriteMovieId): FavoriteResult {
    return {
      success,
      message,
      favorites: this.getFavorites(),
      isFavorite: movieId === undefined ? false : this.isFavorite(movieId),
    };
  }

  private getCurrentUserEmail(): string | null {
    const currentUser = this.authService.currentUser();

    return currentUser ? this.normalizeEmail(currentUser.email) : null;
  }

  private normalizeEmail(email: string): string {
    return String(email || '').trim().toLowerCase();
  }

  private normalizeMovieId(movieId: FavoriteMovieId): string {
    return String(movieId).trim();
  }

  private serializeMovieId(movieId: FavoriteMovieId): FavoriteMovieId {
    const normalizedMovieId = this.normalizeMovieId(movieId);
    const numericMovieId = Number(normalizedMovieId);

    return normalizedMovieId !== '' && Number.isFinite(numericMovieId) ? numericMovieId : normalizedMovieId;
  }

  private normalizeFavoriteList(movieIds: readonly FavoriteMovieId[]): FavoriteMovieId[] {
    const seenMovieIds = new Set<string>();

    return movieIds.reduce<FavoriteMovieId[]>((favorites, movieId) => {
      const normalizedMovieId = this.normalizeMovieId(movieId);

      if (!normalizedMovieId || seenMovieIds.has(normalizedMovieId)) {
        return favorites;
      }

      seenMovieIds.add(normalizedMovieId);
      favorites.push(this.serializeMovieId(movieId));

      return favorites;
    }, []);
  }

  private readFavoritesMap(): FavoritesMap {
    const storage = this.getStorage();

    if (!storage) {
      return {};
    }

    try {
      const rawValue = storage.getItem(STORAGE_KEY);
      const parsedValue = rawValue ? (JSON.parse(rawValue) as FavoritesMap) : {};

      return parsedValue && typeof parsedValue === 'object' ? parsedValue : {};
    } catch {
      return {};
    }
  }

  private writeFavoritesMap(favoritesMap: FavoritesMap): boolean {
    const storage = this.getStorage();

    if (!storage) {
      return false;
    }

    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(favoritesMap));
      return true;
    } catch {
      return false;
    }
  }

  private getStorage(): Storage | null {
    try {
      return globalThis.localStorage ?? null;
    } catch {
      return null;
    }
  }
}
