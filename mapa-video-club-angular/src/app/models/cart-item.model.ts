import { Movie } from './movie.model';

export interface CartItem {
  movie: Movie;
  quantity: number;
}
