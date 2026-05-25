/**
 * Filtros combinables usados por la home para reducir el catalogo visible.
 */
export interface MovieFilters {
  search?: string;
  genre?: string;
  year?: number | string;
  rating?: number | string;
  format?: string;
  available?: boolean;
}
