import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { CartService } from '../../core/services/cart.service';
import { CommentService } from '../../core/services/comment.service';
import { FavoriteService } from '../../core/services/favorite.service';
import { MovieService } from '../../core/services/movie.service';
import { Comment, CommentFormData } from '../../models/comment.model';
import { Movie } from '../../models/movie.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-movie-detail',
  imports: [FormsModule, NavbarComponent, RouterLink],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.scss',
})
export class MovieDetailComponent {
  readonly movieId: string;
  readonly movie?: Movie;
  readonly comments = signal<Comment[]>([]);
  commentForm: CommentFormData = {
    name: '',
    text: '',
  };
  commentFeedback = '';
  commentFeedbackType: 'error' | 'success' | '' = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly movieService: MovieService,
    private readonly favoriteService: FavoriteService,
    private readonly cartService: CartService,
    private readonly commentService: CommentService,
    private readonly router: Router,
  ) {
    this.movieId = this.route.snapshot.paramMap.get('id') ?? '';
    this.movie = this.movieService.getMovieById(this.movieId);
    this.refreshComments();
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

  submitComment(): void {
    const result = this.commentService.addComment(this.movieId, this.commentForm);

    this.commentFeedback = result.message;
    this.commentFeedbackType = result.success ? 'success' : 'error';
    this.comments.set([...result.comments]);

    if (result.success) {
      this.commentForm = {
        name: '',
        text: '',
      };
    }
  }

  deleteComment(commentId: number): void {
    const wasDeleted = this.commentService.deleteComment(this.movieId, commentId);

    this.commentFeedback = wasDeleted
      ? 'Comentario eliminado.'
      : 'No fue posible eliminar el comentario.';
    this.commentFeedbackType = wasDeleted ? 'success' : 'error';
    this.refreshComments();
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

  private refreshComments(): void {
    this.comments.set([...this.commentService.getComments(this.movieId)]);
  }
}
