import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { CartItem } from '../../../models/cart-item.model';

@Component({
  selector: 'app-cart-modal',
  imports: [],
  templateUrl: './cart-modal.component.html',
  styleUrl: './cart-modal.component.scss',
})
/**
 * Presenta el carrito simulado y coordina la compra segun exista sesion activa.
 */
export class CartModalComponent {
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();

  readonly cartItems = this.cartService.cartItems;
  readonly cartTotal = this.cartService.cartTotal;
  checkoutMessage = '';

  close(): void {
    this.checkoutMessage = '';
    this.closed.emit();
  }

  discoverMovies(): void {
    this.close();
    this.router.navigateByUrl('/');
  }

  /**
   * Retira una pelicula del carrito manteniendo el modal abierto.
   */
  removeFromCart(movieId: number): void {
    this.checkoutMessage = '';
    this.cartService.removeFromCart(movieId);
  }

  /**
   * Compra solo con sesion; sin usuario conserva carrito y redirige a login.
   */
  buyCart(): void {
    if (this.cartItems().length === 0) {
      return;
    }

    if (!this.authService.isAuthenticated()) {
      globalThis.localStorage?.setItem('mapaVideoClubCheckoutIntent', 'true');
      this.router.navigateByUrl('/auth');
      this.close();
      return;
    }

    this.cartService.clearCart();
    this.checkoutMessage = 'Compra exitosa. Gracias por rentar en MAPA VIDEO CLUB.';
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      currency: 'COP',
      maximumFractionDigits: 0,
      style: 'currency',
    }).format(price);
  }

  handleImageError(event: Event, fallback = 'assets/img/movie-fallback.svg'): void {
    const image = event.target as HTMLImageElement;

    if (!image.src.endsWith(fallback)) {
      image.src = fallback;
    }
  }

  trackCartItem(_index: number, item: CartItem): number {
    return item.movieId;
  }
}
