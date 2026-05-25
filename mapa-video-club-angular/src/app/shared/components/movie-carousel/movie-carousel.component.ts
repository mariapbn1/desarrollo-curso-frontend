import { Component, Input } from '@angular/core';

import { Movie } from '../../../models/movie.model';
import { MovieCardComponent } from '../movie-card/movie-card.component';

@Component({
  selector: 'app-movie-carousel',
  imports: [MovieCardComponent],
  templateUrl: './movie-carousel.component.html',
  styleUrl: './movie-carousel.component.scss',
})
export class MovieCarouselComponent {
  @Input() title = 'Peliculas';
  @Input() movies: readonly Movie[] = [];
}
