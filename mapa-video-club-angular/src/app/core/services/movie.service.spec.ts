import { TestBed } from '@angular/core/testing';

import { MOVIES } from '../../data/movies.data';
import { MovieService } from './movie.service';

describe('MovieService', () => {
  let service: MovieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return movies from the local catalog', () => {
    expect(service.getMovies().length).toBe(MOVIES.length);
    expect(service.getMovies()[0].poster).toContain('assets/img/');
  });

  it('should find a movie by id', () => {
    const movie = service.getMovieById(MOVIES[0].id);

    expect(movie?.title).toBe(MOVIES[0].title);
  });

  it('should get latest movies ordered by release date desc', () => {
    const latestMovies = service.getLatestMovies(3);

    expect(latestMovies.length).toBe(3);
    expect(new Date(latestMovies[0].releaseDate).getTime()).toBeGreaterThanOrEqual(
      new Date(latestMovies[1].releaseDate).getTime(),
    );
  });

  it('should get top rental movies by tag', () => {
    const topRentalMovies = service.getTopRentalMovies(5);

    expect(topRentalMovies.length).toBeGreaterThan(0);
    expect(topRentalMovies.every((movie) => movie.tags.includes('Top renta'))).toBe(true);
  });

  it('should get popular movies ordered by rating desc', () => {
    const popularMovies = service.getPopularMovies(4);

    expect(popularMovies.length).toBe(4);
    expect(popularMovies[0].rating).toBeGreaterThanOrEqual(popularMovies[1].rating);
  });

  it('should filter movies by text', () => {
    const filteredMovies = service.filterMovies({ search: 'dune' });

    expect(filteredMovies.some((movie) => movie.title === 'Dune: Part Two')).toBe(true);
  });

  it('should filter movies by genre', () => {
    const filteredMovies = service.filterMovies({ genre: 'Accion' });

    expect(filteredMovies.length).toBeGreaterThan(0);
    expect(filteredMovies.every((movie) => movie.genre === 'Accion')).toBe(true);
  });
});
