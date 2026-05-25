import { Component } from '@angular/core';

import { MovieCarouselComponent } from '../movie-carousel/movie-carousel.component';

@Component({
  selector: 'app-featured-shelves',
  imports: [MovieCarouselComponent],
  templateUrl: './featured-shelves.component.html',
  styleUrl: './featured-shelves.component.scss',
})
export class FeaturedShelvesComponent {}
