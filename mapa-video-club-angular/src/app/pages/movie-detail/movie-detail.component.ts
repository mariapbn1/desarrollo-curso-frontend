import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { FavoriteService } from '../../core/services/favorite.service';
import { MovieService } from '../../core/services/movie.service';
import { Movie } from '../../models/movie.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-movie-detail',
  imports: [NavbarComponent, RouterLink],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.scss',
})
export class MovieDetailComponent {
  readonly movieId: string;
  readonly movie?: Movie;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly movieService: MovieService,
    private readonly favoriteService: FavoriteService,
    private readonly router: Router,
  ) {
    this.movieId = this.route.snapshot.paramMap.get('id') ?? '';
    this.movie = this.movieService.getMovieById(this.movieId);
  }

  isFavorite(movieId: number): boolean {
    return this.favoriteService.isFavorite(movieId);
  }

  toggleFavorite(movieId: number): void {
    const result = this.favoriteService.toggleFavorite(movieId);

    if (!result.success) {
      this.router.navigateByUrl('/auth');
    }
  }

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
