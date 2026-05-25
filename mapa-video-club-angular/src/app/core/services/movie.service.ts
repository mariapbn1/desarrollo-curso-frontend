import { Injectable, signal } from '@angular/core';

import { Movie } from '../../models/movie.model';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private readonly movies = signal<Movie[]>([]);

  getMovies(): readonly Movie[] {
    return this.movies();
  }

  getMovieById(id: string): Movie | undefined {
    return this.movies().find((movie) => movie.id === id);
  }

  setMovies(movies: readonly Movie[]): void {
    this.movies.set([...movies]);
  }
}
