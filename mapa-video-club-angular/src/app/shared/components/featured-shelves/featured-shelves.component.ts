import { Component, Input } from '@angular/core';

import { Movie } from '../../../models/movie.model';
import { MovieCarouselComponent } from '../movie-carousel/movie-carousel.component';

@Component({
  selector: 'app-featured-shelves',
  imports: [MovieCarouselComponent],
  templateUrl: './featured-shelves.component.html',
  styleUrl: './featured-shelves.component.scss',
})
export class FeaturedShelvesComponent {
  @Input() topRentalMovies: readonly Movie[] = [];
  @Input() popularMovies: readonly Movie[] = [];
}
