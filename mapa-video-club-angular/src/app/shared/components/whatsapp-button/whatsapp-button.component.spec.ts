import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappButtonComponent } from './whatsapp-button.component';

describe('WhatsappButtonComponent', () => {
  let component: WhatsappButtonComponent;
  let fixture: ComponentFixture<WhatsappButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhatsappButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WhatsappButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open and close the confirmation modal', async () => {
    component.openModal();
    fixture.detectChanges();
    await fixture.whenStable();

    let compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.whatsapp-modal')?.hasAttribute('hidden')).toBe(false);

    component.closeModal();
    fixture.detectChanges();
    await fixture.whenStable();

    compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.whatsapp-modal')?.hasAttribute('hidden')).toBe(true);
  });
});
