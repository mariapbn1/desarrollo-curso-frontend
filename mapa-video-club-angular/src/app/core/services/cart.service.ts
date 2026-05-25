import { computed, inject, Injectable, signal } from '@angular/core';

import { CartEntry, CartItem } from '../../models/cart-item.model';
import { Movie } from '../../models/movie.model';
import { MovieService } from './movie.service';

export interface CartResult {
  success: boolean;
  message: string;
  cart: readonly CartEntry[];
}

const STORAGE_KEY = 'mapaVideoClubCart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly movieService = inject(MovieService);
  private readonly cartSignal = signal<CartEntry[]>(this.readCart());

  readonly cart = this.cartSignal.asReadonly();
  readonly cartItems = computed(() => this.buildCartItems(this.cartSignal()));
  readonly cartTotal = computed(() =>
    this.cartItems().reduce((total, item) => total + item.subtotal, 0),
  );
  readonly cartCount = computed(() =>
    this.cartSignal().reduce((count, item) => count + item.quantity, 0),
  );

  getCart(): readonly CartEntry[] {
    return [...this.cartSignal()];
  }

  getItems(): readonly CartItem[] {
    return this.getCartItems();
  }

  addItem(movie: Movie, quantity = 1): void {
    if (quantity > 0) {
      this.addToCart(movie.id);
    }
  }

  addToCart(movieId: number | string): CartResult {
    const normalizedMovieId = this.normalizeMovieId(movieId);
    const movie = normalizedMovieId ? this.movieService.getMovieById(normalizedMovieId) : undefined;

    if (!normalizedMovieId || !movie) {
      return this.createResult(false, 'La pelicula no existe.');
    }

    if (this.isInCart(normalizedMovieId)) {
      return this.createResult(true, 'La pelicula ya esta en el carrito.');
    }

    if (!this.isMovieAvailable(movie)) {
      return this.createResult(false, 'Esta pelicula esta agotada.');
    }

    return this.saveCart([
      ...this.cartSignal(),
      {
        movieId: normalizedMovieId,
        quantity: 1,
      },
    ], 'Pelicula agregada al carrito.');
  }

  removeFromCart(movieId: number | string): CartResult {
    const normalizedMovieId = this.normalizeMovieId(movieId);
    const nextCart = this.cartSignal().filter((item) => item.movieId !== normalizedMovieId);

    return this.saveCart(nextCart, 'Pelicula eliminada del carrito.');
  }

  clearCart(): CartResult {
    return this.saveCart([], 'Carrito vacio.');
  }

  clear(): void {
    this.clearCart();
  }

  isInCart(movieId: number | string): boolean {
    const normalizedMovieId = this.normalizeMovieId(movieId);

    return this.cartSignal().some((item) => item.movieId === normalizedMovieId);
  }

  getCartItems(): readonly CartItem[] {
    return [...this.cartItems()];
  }

  getCartTotal(): number {
    return this.cartTotal();
  }

  getCartCount(): number {
    return this.cartCount();
  }

  private buildCartItems(cart: readonly CartEntry[]): CartItem[] {
    return cart.reduce<CartItem[]>((items, entry) => {
      const movie = this.movieService.getMovieById(entry.movieId);

      if (!movie) {
        return items;
      }

      const unitPrice = typeof movie.rentalPrice === 'number' ? movie.rentalPrice : 0;
      const quantity = Math.max(1, Number(entry.quantity) || 1);

      items.push({
        movieId: entry.movieId,
        movie,
        quantity,
        unitPrice,
        subtotal: unitPrice * quantity,
        isAvailable: this.isMovieAvailable(movie),
      });

      return items;
    }, []);
  }

  private saveCart(cart: readonly CartEntry[], message: string): CartResult {
    const normalizedCart = this.normalizeCart(cart);

    if (!this.writeCart(normalizedCart)) {
      return this.createResult(false, 'No fue posible guardar el carrito.');
    }

    this.cartSignal.set(normalizedCart);

    return this.createResult(true, message);
  }

  private createResult(success: boolean, message: string): CartResult {
    return {
      success,
      message,
      cart: this.getCart(),
    };
  }

  private isMovieAvailable(movie: Movie): boolean {
    return movie.available && movie.stock > 0;
  }

  private normalizeCart(cart: readonly CartEntry[]): CartEntry[] {
    const movieIds = new Set<number>();

    return cart.reduce<CartEntry[]>((normalizedCart, item) => {
      const movieId = this.normalizeMovieId(item.movieId);

      if (!movieId || movieIds.has(movieId)) {
        return normalizedCart;
      }

      movieIds.add(movieId);
      normalizedCart.push({
        movieId,
        quantity: Math.max(1, Number(item.quantity) || 1),
      });

      return normalizedCart;
    }, []);
  }

  private normalizeMovieId(movieId: number | string): number {
    const normalizedMovieId = Number(movieId);

    return Number.isFinite(normalizedMovieId) && normalizedMovieId > 0 ? normalizedMovieId : 0;
  }

  private readCart(): CartEntry[] {
    const storage = this.getStorage();

    if (!storage) {
      return [];
    }

    try {
      const rawValue = storage.getItem(STORAGE_KEY);
      const parsedValue = rawValue ? (JSON.parse(rawValue) as CartEntry[]) : [];

      return Array.isArray(parsedValue) ? this.normalizeCart(parsedValue) : [];
    } catch {
      return [];
    }
  }

  private writeCart(cart: readonly CartEntry[]): boolean {
    const storage = this.getStorage();

    if (!storage) {
      return false;
    }

    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(cart));
      return true;
    } catch {
      return false;
    }
  }

  private getStorage(): Storage | null {
    try {
      return globalThis.localStorage ?? null;
    } catch {
      return null;
    }
  }
}
