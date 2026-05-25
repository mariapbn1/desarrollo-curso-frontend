import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { FavoriteService } from '../../../core/services/favorite.service';
import { MOVIES } from '../../../data/movies.data';
import { MovieCardComponent } from './movie-card.component';

describe('MovieCardComponent', () => {
  let authService: AuthService;
  let cartService: CartService;
  let component: MovieCardComponent;
  let favoriteService: FavoriteService;
  let fixture: ComponentFixture<MovieCardComponent>;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [MovieCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieCardComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    cartService = TestBed.inject(CartService);
    favoriteService = TestBed.inject(FavoriteService);
    await fixture.whenStable();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render movie data when input is provided', async () => {
    fixture.componentRef.setInput('movie', MOVIES[0]);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain(MOVIES[0].title);
    expect(compiled.textContent).toContain(MOVIES[0].format);
  });

  it('should reflect favorite state when movie is favorite', async () => {
    authService.setCurrentUser({ id: '1', name: 'Laura', email: 'laura@mail.com' });
    favoriteService.addFavorite(MOVIES[0].id);
    fixture.componentRef.setInput('movie', MOVIES[0]);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const favoriteButton = compiled.querySelector('.movie-favorite-toggle');

    expect(favoriteButton?.classList.contains('is-active')).toBe(true);
  });

  it('should add movie to cart and reflect cart state', async () => {
    fixture.componentRef.setInput('movie', MOVIES[0]);
    component.addToCart(MOVIES[0], new Event('click'));
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(cartService.isInCart(MOVIES[0].id)).toBe(true);
    expect(compiled.textContent).toContain('En carrito');
  });
});
