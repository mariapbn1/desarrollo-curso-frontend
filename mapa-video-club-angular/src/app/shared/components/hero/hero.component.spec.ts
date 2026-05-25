import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { FavoriteService } from '../../../core/services/favorite.service';
import { MOVIES } from '../../../data/movies.data';
import { HeroComponent } from './hero.component';

describe('HeroComponent', () => {
  let authService: AuthService;
  let favoriteService: FavoriteService;
  let fixture: ComponentFixture<HeroComponent>;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [HeroComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroComponent);
    authService = TestBed.inject(AuthService);
    favoriteService = TestBed.inject(FavoriteService);
    await fixture.whenStable();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should reflect favorite state when movie is favorite', async () => {
    authService.setCurrentUser({ id: '1', name: 'Laura', email: 'laura@mail.com' });
    favoriteService.addFavorite(MOVIES[0].id);
    fixture.componentRef.setInput('movie', MOVIES[0]);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.hero-favorite')?.classList.contains('is-active')).toBe(true);
  });
});
