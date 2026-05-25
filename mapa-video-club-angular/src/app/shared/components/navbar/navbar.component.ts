import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { CartModalComponent } from '../cart-modal/cart-modal.component';

@Component({
  selector: 'app-navbar',
  imports: [CartModalComponent, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  readonly currentUser = this.authService.currentUser;
  readonly cartCount = this.cartService.cartCount;
  isCartOpen = false;

  openCart(): void {
    this.isCartOpen = true;
  }

  closeCart(): void {
    this.isCartOpen = false;
  }

  logout(): void {
    this.authService.logoutUser();
  }
}
