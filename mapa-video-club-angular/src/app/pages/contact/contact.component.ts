import { Component } from '@angular/core';

import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { WhatsappButtonComponent } from '../../shared/components/whatsapp-button/whatsapp-button.component';

@Component({
  selector: 'app-contact',
  imports: [NavbarComponent, WhatsappButtonComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {}
