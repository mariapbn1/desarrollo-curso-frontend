import { TestBed } from '@angular/core/testing';

import { WhatsappService } from './whatsapp.service';

describe('WhatsappService', () => {
  let service: WhatsappService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WhatsappService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should build whatsapp url with configured number', () => {
    expect(service.buildWhatsappUrl()).toContain('https://wa.me/573105841049');
  });

  it('should encode the default message', () => {
    const encodedMessage = encodeURIComponent(service.contactMessage);

    expect(service.buildWhatsappUrl()).toContain(`text=${encodedMessage}`);
  });
});
