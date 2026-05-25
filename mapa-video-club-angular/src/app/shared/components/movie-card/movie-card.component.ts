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
}
