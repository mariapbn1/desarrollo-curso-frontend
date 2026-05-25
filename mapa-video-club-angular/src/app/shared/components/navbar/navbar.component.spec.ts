import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { MOVIES } from '../../../data/movies.data';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let authService: AuthService;
  let cartService: CartService;
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    cartService = TestBed.inject(CartService);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show login access when there is no active user', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Ingresar');
    expect(compiled.querySelector('[aria-label="Favoritos"]')).toBeNull();
  });

  it('should include contact route', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const contactLink = compiled.querySelector<HTMLAnchorElement>('a[href="/contacto"]');

    expect(compiled.textContent).toContain('Contacto');
    expect(contactLink).toBeTruthy();
  });

  it('should show active user and logout', async () => {
    authService.registerUser({
      name: 'Laura',
      email: 'laura@mail.com',
      password: 'secreta1',
      confirmPassword: 'secreta1',
    });
    authService.loginUser('laura@mail.com', 'secreta1');
    fixture.detectChanges();
    await fixture.whenStable();

    let compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Hola, Laura');
    expect(compiled.querySelector('[aria-label="Favoritos"]')).toBeTruthy();

    component.logout();
    fixture.detectChanges();
    await fixture.whenStable();

    compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Ingresar');
  });

  it('should open cart modal and show cart count', async () => {
    cartService.addToCart(MOVIES[0].id);
    component.openCart();
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(component.isCartOpen).toBe(true);
    expect(compiled.querySelector('.cart-count-badge')?.textContent).toContain('1');
    expect(compiled.querySelector('.cart-modal')).toBeTruthy();
  });
});
