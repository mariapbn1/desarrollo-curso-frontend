import { Component, inject, signal } from '@angular/core';

import { WhatsappService } from '../../../core/services/whatsapp.service';

@Component({
  selector: 'app-whatsapp-button',
  imports: [],
  templateUrl: './whatsapp-button.component.html',
  styleUrl: './whatsapp-button.component.scss',
})
/**
 * Muestra el acceso flotante a WhatsApp con confirmacion previa.
 */
export class WhatsappButtonComponent {
  private readonly whatsappService = inject(WhatsappService);

  readonly isModalOpen = signal(false);
  readonly message = this.whatsappService.contactMessage;

  openModal(): void {
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  /**
   * Abre WhatsApp usando el mensaje general definido en el servicio.
   */
  contact(): void {
    this.whatsappService.openWhatsappContact();
    this.closeModal();
  }
}
