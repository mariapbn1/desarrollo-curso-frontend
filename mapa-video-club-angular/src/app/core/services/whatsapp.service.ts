import { Injectable } from '@angular/core';

const WHATSAPP_NUMBER = '573105841049';
const WHATSAPP_MESSAGE =
  'Hola, quer\u00eda hacer una consulta sobre una pel\u00edcula de MAPA VIDEO CLUB.';

@Injectable({
  providedIn: 'root',
})
/**
 * Construye el contacto general de WhatsApp sin vincularlo a pedidos o carrito.
 */
export class WhatsappService {
  readonly contactMessage = WHATSAPP_MESSAGE;

  /**
   * Genera la URL oficial de WhatsApp con mensaje codificado.
   */
  buildWhatsappUrl(): string {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
  }

  /**
   * Abre el canal de contacto en una pestana nueva.
   */
  openWhatsappContact(): void {
    globalThis.open?.(this.buildWhatsappUrl(), '_blank', 'noopener,noreferrer');
  }
}
