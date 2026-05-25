import { Injectable, signal } from '@angular/core';

import { MOVIES } from '../../data/movies.data';
import { MovieFilters } from '../../models/movie-filter.model';
import { Movie } from '../../models/movie.model';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private readonly movies = signal<Movie[]>([...MOVIES]);

  getMovies(): Movie[] {
    return [...this.movies()];
  }

  getMovieById(id: number | string): Movie | undefined {
    return this.movies().find((movie) => String(movie.id) === String(id));
  }

  getLatestMovies(limit = this.movies().length): Movie[] {
    return this.getMovies()
      .sort((movieA, movieB) => this.sortByDateDesc(movieA, movieB))
      .slice(0, this.normalizeLimit(limit));
  }

  getTopRentalMovies(limit = this.movies().length): Movie[] {
    return this.getMovies()
      .filter((movie) => this.hasTag(movie, 'Top renta'))
      .sort((movieA, movieB) => this.sortByDateDesc(movieA, movieB))
      .slice(0, this.normalizeLimit(limit));
  }

  getPopularMovies(limit = this.movies().length): Movie[] {
    return this.getMovies()
      .sort((movieA, movieB) => movieB.rating - movieA.rating || this.sortByDateDesc(movieA, movieB))
      .slice(0, this.normalizeLimit(limit));
  }

  getTopRatedMovies(limit = this.movies().length): Movie[] {
    return this.getPopularMovies(limit);
  }

  filterMovies(filters: MovieFilters = {}): Movie[] {
    const normalizedSearch = this.normalizeText(filters.search);
    const normalizedGenre = this.normalizeText(filters.genre);
    const normalizedFormat = this.normalizeText(filters.format);
    const selectedYear = filters.year ? String(filters.year) : '';
    const minimumRating = Number(filters.rating || 0);

    return this.getMovies()
      .filter((movie) => {
        const matchesSearch = !normalizedSearch || this.getSearchableText(movie).includes(normalizedSearch);
        const matchesGenre = !normalizedGenre || this.normalizeText(movie.genre) === normalizedGenre;
        const matchesYear = !selectedYear || String(movie.year) === selectedYear;
        const matchesRating = !minimumRating || movie.rating >= minimumRating;
        const matchesFormat =
          !normalizedFormat ||
          this.normalizeText(movie.format) === normalizedFormat ||
          this.normalizeText(movie.format).includes(normalizedFormat);
        const matchesAvailability =
          filters.available === undefined || movie.available === filters.available;

        return matchesSearch && matchesGenre && matchesYear && matchesRating && matchesFormat && matchesAvailability;
      })
      .sort((movieA, movieB) => this.sortByDateDesc(movieA, movieB));
  }

  getMovieYear(movie: Movie): string {
    return String(movie.year);
  }

  setMovies(movies: readonly Movie[]): void {
    this.movies.set([...movies]);
  }

  private sortByDateDesc(movieA: Movie, movieB: Movie): number {
    return new Date(movieB.releaseDate).getTime() - new Date(movieA.releaseDate).getTime();
  }

  private hasTag(movie: Movie, expectedTag: string): boolean {
    const normalizedExpectedTag = this.normalizeText(expectedTag);

    return movie.tags.some((tag) => this.normalizeText(tag) === normalizedExpectedTag);
  }

  private getSearchableText(movie: Movie): string {
    return this.normalizeText([
      movie.title,
      movie.genre,
      movie.synopsis,
      movie.review,
      movie.format,
      ...movie.actors,
      ...movie.tags,
    ].join(' '));
  }

  private normalizeLimit(limit: number): number {
    return Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : this.movies().length;
  }

  private normalizeText(value?: string | number): string {
    return String(value ?? '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
}
