import { Component } from '@angular/core';

import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-auth',
  imports: [NavbarComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {}
