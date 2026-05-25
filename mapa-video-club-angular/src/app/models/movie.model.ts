export interface Movie {
  id: number;
  title: string;
  genre: string;
  releaseDate: string;
  year: number;
  rating: number;
  synopsis: string;
  review: string;
  poster: string;
  banner: string;
  fallback: string;
  actors: string[];
  photos: string[];
  rentalPrice: number;
  format: string;
  stock: number;
  available: boolean;
  rentalTime: string;
  tags: string[];
}
