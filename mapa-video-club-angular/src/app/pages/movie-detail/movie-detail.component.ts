import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-movie-detail',
  imports: [NavbarComponent, RouterLink],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.scss',
})
export class MovieDetailComponent {
  readonly movieId: string;

  constructor(private readonly route: ActivatedRoute) {
    this.movieId = this.route.snapshot.paramMap.get('id') ?? '';
  }
}
