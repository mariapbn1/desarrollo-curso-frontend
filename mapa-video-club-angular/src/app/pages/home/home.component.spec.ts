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
