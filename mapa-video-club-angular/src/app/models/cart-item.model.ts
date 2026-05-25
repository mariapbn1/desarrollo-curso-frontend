import { Movie } from './movie.model';

/**
 * Entrada minima persistida en localStorage para reconstruir el carrito.
 */
export interface CartEntry {
  movieId: number;
  quantity: number;
}

/**
 * Item enriquecido para la vista del carrito con datos reales de pelicula y subtotal.
 */
export interface CartItem {
  movieId: number;
  movie: Movie;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  isAvailable: boolean;
}
