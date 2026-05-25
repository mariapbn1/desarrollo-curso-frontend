import { Component, Input, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { CartService } from '../../../core/services/cart.service';
import { FavoriteService } from '../../../core/services/favorite.service';
import { Movie } from '../../../models/movie.model';

@Component({
  selector: 'app-hero',
  imports: [RouterLink],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  private readonly cartService = inject(CartService);
  private readonly favoriteService = inject(FavoriteService);
  private readonly router = inject(Router);

  @Input() movie?: Movie;

  isFavorite(movieId: number): boolean {
    return this.favoriteService.isFavorite(movieId);
  }

  toggleFavorite(movieId: number): void {
    const result = this.favoriteService.toggleFavorite(movieId);

    if (!result.success) {
      this.router.navigateByUrl('/auth');
    }
  }

  addToCart(movie: Movie): void {
    this.cartService.addToCart(movie.id);
  }

  isInCart(movieId: number): boolean {
    return this.cartService.isInCart(movieId);
  }

  canAddToCart(movie: Movie): boolean {
    return movie.available && movie.stock > 0 && !this.isInCart(movie.id);
  }

  getCartButtonLabel(movie: Movie): string {
    if (!movie.available || movie.stock <= 0) {
      return 'Agotada';
    }

    return this.isInCart(movie.id) ? 'En carrito' : 'Agregar al carrito';
  }

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
