export interface Movie {
  id: string;
  title: string;
  synopsis: string;
  genre: string;
  year: number;
  posterUrl: string;
  backdropUrl?: string;
  durationMinutes?: number;
  rating?: number;
}
