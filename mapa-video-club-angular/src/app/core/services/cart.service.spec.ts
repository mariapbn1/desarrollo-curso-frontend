import { TestBed } from '@angular/core/testing';

import { MOVIES } from '../../data/movies.data';
import { MovieService } from './movie.service';
import { CartService } from './cart.service';

describe('CartService', () => {
  let movieService: MovieService;
  let service: CartService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    movieService = TestBed.inject(MovieService);
    movieService.setMovies(MOVIES);
    service = TestBed.inject(CartService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add an available movie', () => {
    const result = service.addToCart(MOVIES[0].id);

    expect(result.success).toBe(true);
    expect(service.getCart()).toEqual([{ movieId: MOVIES[0].id, quantity: 1 }]);
  });

  it('should not duplicate a movie', () => {
    service.addToCart(MOVIES[0].id);
    service.addToCart(MOVIES[0].id);

    expect(service.getCartCount()).toBe(1);
  });

  it('should not add an unavailable movie', () => {
    const unavailableMovie = {
      ...MOVIES[0],
      id: 999999,
      available: false,
      stock: 0,
    };
    movieService.setMovies([unavailableMovie]);

    const result = service.addToCart(unavailableMovie.id);

    expect(result.success).toBe(false);
    expect(service.getCart()).toEqual([]);
  });

  it('should remove a movie', () => {
    service.addToCart(MOVIES[0].id);
    service.removeFromCart(MOVIES[0].id);

    expect(service.isInCart(MOVIES[0].id)).toBe(false);
  });

  it('should calculate the cart total', () => {
    service.addToCart(MOVIES[0].id);

    expect(service.getCartTotal()).toBe(MOVIES[0].rentalPrice);
  });

  it('should clear the cart', () => {
    service.addToCart(MOVIES[0].id);
    service.clearCart();

    expect(service.getCart()).toEqual([]);
  });
});
