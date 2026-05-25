import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { FavoriteService } from '../../core/services/favorite.service';
import { MovieService } from '../../core/services/movie.service';
import { MovieFilters } from '../../models/movie-filter.model';
import { Movie } from '../../models/movie.model';
import { FeaturedShelvesComponent } from '../../shared/components/featured-shelves/featured-shelves.component';
import { FiltersBarComponent } from '../../shared/components/filters-bar/filters-bar.component';
import { HeroComponent } from '../../shared/components/hero/hero.component';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { WhatsappButtonComponent } from '../../shared/components/whatsapp-button/whatsapp-button.component';

@Component({
  selector: 'app-home',
  imports: [
    FeaturedShelvesComponent,
    FiltersBarComponent,
    HeroComponent,
    MovieCardComponent,
    NavbarComponent,
    RouterLink,
    WhatsappButtonComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly authService = inject(AuthService);
  private readonly favoriteService = inject(FavoriteService);
  private readonly movieService = inject(MovieService);
  private readonly route = inject(ActivatedRoute);
  private readonly queryParamMap = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  readonly currentUser = this.authService.currentUser;
  readonly featuredMovie = this.movieService.getLatestMovies(1)[0];
  readonly latestMovies = this.movieService.getLatestMovies(6);
  readonly topRentalMovies = this.movieService.getTopRentalMovies(6);
  readonly popularMovies = this.movieService.getPopularMovies(6);
  readonly favoriteMovies = computed(() => {
    const favoriteIds = new Set(this.favoriteService.getFavorites().map((movieId) => String(movieId)));

    return this.movieService.getMovies().filter((movie) => favoriteIds.has(String(movie.id)));
  });
  readonly showFavoritesView = computed(
    () => this.queryParamMap().get('view') === 'favorites' && this.currentUser() !== null,
  );
  readonly genres = this.getUniqueSortedValues((movie) => movie.genre);
  readonly years = this.getUniqueSortedValues((movie) => String(movie.year)).sort(
    (yearA, yearB) => Number(yearB) - Number(yearA),
  );
  readonly formats = this.getUniqueSortedValues((movie) => movie.format);
  readonly catalogMovies = signal<Movie[]>(this.movieService.getMovies());
  readonly visibleCatalogMovies = computed(() =>
    this.showFavoritesView() ? this.favoriteMovies() : this.catalogMovies(),
  );

  onFiltersChange(filters: MovieFilters): void {
    this.catalogMovies.set(this.movieService.filterMovies(filters));
  }

  private getUniqueSortedValues(selector: (movie: Movie) => string): string[] {
    return Array.from(new Set(this.movieService.getMovies().map(selector))).sort((valueA, valueB) =>
      valueA.localeCompare(valueB),
    );
  }
}
