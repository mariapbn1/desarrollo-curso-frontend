import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private readonly favoriteMovieIds = signal<Set<string>>(new Set());

  getFavoriteMovieIds(): readonly string[] {
    return [...this.favoriteMovieIds()];
  }

  isFavorite(movieId: string): boolean {
    return this.favoriteMovieIds().has(movieId);
  }

  toggleFavorite(movieId: string): void {
    this.favoriteMovieIds.update((ids) => {
      const nextIds = new Set(ids);

      if (nextIds.has(movieId)) {
        nextIds.delete(movieId);
      } else {
        nextIds.add(movieId);
      }

      return nextIds;
    });
  }
}
