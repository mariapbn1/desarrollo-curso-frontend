import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { WhatsappService } from '../../core/services/whatsapp.service';
import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let whatsappService: WhatsappService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    whatsappService = TestBed.inject(WhatsappService);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render contact page content', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Contacto');
    expect(compiled.textContent).toContain('Contactar por WhatsApp');
  });

  it('should use WhatsappService for the contact action', () => {
    const openSpy = vi.spyOn(whatsappService, 'openWhatsappContact').mockImplementation(() => undefined);

    component.contactByWhatsapp();

    expect(openSpy).toHaveBeenCalledOnce();
  });
});
