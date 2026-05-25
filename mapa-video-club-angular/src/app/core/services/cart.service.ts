import { Injectable, signal } from '@angular/core';

import { CartItem } from '../../models/cart-item.model';
import { Movie } from '../../models/movie.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly items = signal<CartItem[]>([]);

  getItems(): readonly CartItem[] {
    return this.items();
  }

  addItem(movie: Movie, quantity = 1): void {
    const safeQuantity = Math.max(1, quantity);

    this.items.update((items) => {
      const existing = items.find((item) => item.movie.id === movie.id);

      if (!existing) {
        return [...items, { movie, quantity: safeQuantity }];
      }

      return items.map((item) =>
        item.movie.id === movie.id
          ? { ...item, quantity: item.quantity + safeQuantity }
          : item,
      );
    });
  }

  clear(): void {
    this.items.set([]);
  }
}
