import { Movie } from './movie.model';

export interface CartEntry {
  movieId: number;
  quantity: number;
}

export interface CartItem {
  movieId: number;
  movie: Movie;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  isAvailable: boolean;
}
