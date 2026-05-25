import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { MOVIES } from '../../../data/movies.data';
import { CartModalComponent } from './cart-modal.component';

describe('CartModalComponent', () => {
  let authService: AuthService;
  let cartService: CartService;
  let component: CartModalComponent;
  let fixture: ComponentFixture<CartModalComponent>;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [CartModalComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CartModalComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    cartService = TestBed.inject(CartService);
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not clear cart when buying without session', () => {
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    cartService.addToCart(MOVIES[0].id);

    component.buyCart();

    expect(cartService.getCartCount()).toBe(1);
  });

  it('should clear cart when buying with active session', () => {
    authService.setCurrentUser({ id: '1', name: 'Laura', email: 'laura@mail.com' });
    cartService.addToCart(MOVIES[0].id);

    component.buyCart();

    expect(cartService.getCartCount()).toBe(0);
    expect(component.checkoutMessage).toContain('Compra exitosa');
  });
});
