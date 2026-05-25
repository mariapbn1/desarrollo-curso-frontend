import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Movie } from '../../../models/movie.model';

@Component({
  selector: 'app-movie-card',
  imports: [RouterLink],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
})
export class MovieCardComponent {
  @Input() movie?: Movie;

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      currency: 'COP',
      maximumFractionDigits: 0,
      style: 'currency',
    }).format(price);
  }

  getAvailabilityLabel(movie: Movie): string {
    return movie.available && movie.stock > 0 ? 'Disponible' : 'Agotada';
  }

  handleImageError(event: Event, fallback: string): void {
    const image = event.target as HTMLImageElement;

    if (!image.src.endsWith(fallback)) {
      image.src = fallback;
    }
  }
}
