import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { FavoriteService } from '../../core/services/favorite.service';
import { MOVIES } from '../../data/movies.data';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let authService: AuthService;
  let component: HomeComponent;
  let favoriteService: FavoriteService;
  let fixture: ComponentFixture<HomeComponent>;

  async function setup(queryParams: Record<string, string> = {}): Promise<void> {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of(convertToParamMap(queryParams)),
            snapshot: {
              queryParamMap: convertToParamMap(queryParams),
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    favoriteService = TestBed.inject(FavoriteService);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  afterEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  it('should create', async () => {
    await setup();

    expect(component).toBeTruthy();
  });

  it('should load catalog movies from MovieService', async () => {
    await setup();

    expect(component.catalogMovies().length).toBeGreaterThan(0);
    expect(component.featuredMovie).toBeTruthy();
  });

  it('should show only filtered results when filters are active', async () => {
    await setup();

    component.onFiltersChange({ search: 'michael' });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.hasActiveFilters()).toBe(true);
    expect(component.catalogTitle()).toBe('Resultados filtrados');
    expect(component.visibleCatalogMovies().map((movie) => movie.title)).toEqual(['Michael']);
    expect(fixture.nativeElement.textContent).not.toContain('Recien llegadas');
  });

  it('should restore normal catalog when filters are cleared', async () => {
    await setup();

    component.onFiltersChange({ search: 'michael' });
    component.onFiltersChange({});
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.hasActiveFilters()).toBe(false);
    expect(component.catalogTitle()).toBe('Todas las peliculas');
    expect(component.visibleCatalogMovies().length).toBe(MOVIES.length);
    expect(fixture.nativeElement.textContent).toContain('Recien llegadas');
  });

  it('should show only favorite movies in favorites view with active user', async () => {
    await setup({ view: 'favorites' });
    authService.setCurrentUser({ id: '1', name: 'Laura', email: 'laura@mail.com' });
    favoriteService.addFavorite(MOVIES[0].id);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.showFavoritesView()).toBe(true);
    expect(component.visibleCatalogMovies().map((movie) => movie.id)).toEqual([MOVIES[0].id]);
  });
});
