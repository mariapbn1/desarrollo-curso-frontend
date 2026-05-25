import { Component, inject } from '@angular/core';

import { WhatsappService } from '../../core/services/whatsapp.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-contact',
  imports: [NavbarComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  private readonly whatsappService = inject(WhatsappService);
  readonly whatsappMessage = this.whatsappService.contactMessage;

  contactByWhatsapp(): void {
    this.whatsappService.openWhatsappContact();
  }
}
