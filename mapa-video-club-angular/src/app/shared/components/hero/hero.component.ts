import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Movie } from '../../../models/movie.model';

@Component({
  selector: 'app-hero',
  imports: [RouterLink],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  @Input() movie?: Movie;

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      currency: 'COP',
      maximumFractionDigits: 0,
      style: 'currency',
    }).format(price);
  }

  getAvailabilityLabel(movie: Movie): string {
    return movie.available && movie.stock > 0 ? `${movie.stock} disponibles` : 'Agotada';
  }
}
