import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';

import { CartService } from '../../core/services/cart.service';
import { MOVIES } from '../../data/movies.data';
import { MovieDetailComponent } from './movie-detail.component';

describe('MovieDetailComponent', () => {
  async function setup(routeId: string): Promise<ComponentFixture<MovieDetailComponent>> {
    localStorage.clear();
    TestBed.resetTestingModule();

    await TestBed.configureTestingModule({
      imports: [MovieDetailComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: routeId }),
            },
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(MovieDetailComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    return fixture;
  }

  it('should create', async () => {
    const fixture = await setup(String(MOVIES[0].id));

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render an existing movie by route id', async () => {
    const selectedMovie = MOVIES[0];
    const fixture = await setup(String(selectedMovie.id));
    const compiled = fixture.nativeElement as HTMLElement;

    expect(fixture.componentInstance.movie?.id).toBe(selectedMovie.id);
    expect(compiled.textContent).toContain(selectedMovie.title);
    expect(compiled.textContent).toContain(selectedMovie.review);
  });

  it('should render not found state when id does not exist', async () => {
    const fixture = await setup('movie-not-found');
    const compiled = fixture.nativeElement as HTMLElement;

    expect(fixture.componentInstance.movie).toBeUndefined();
    expect(compiled.textContent).toContain('Pel\u00edcula no encontrada');
  });

  it('should add movie to cart from detail', async () => {
    const fixture = await setup(String(MOVIES[0].id));
    const cartService = TestBed.inject(CartService);

    fixture.componentInstance.addToCart(MOVIES[0]);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(cartService.isInCart(MOVIES[0].id)).toBe(true);
  });
});
