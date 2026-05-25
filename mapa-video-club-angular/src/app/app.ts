import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { WhatsappButtonComponent } from './shared/components/whatsapp-button/whatsapp-button.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WhatsappButtonComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
