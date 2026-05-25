import { Component } from '@angular/core';

import { FeaturedShelvesComponent } from '../../shared/components/featured-shelves/featured-shelves.component';
import { FiltersBarComponent } from '../../shared/components/filters-bar/filters-bar.component';
import { HeroComponent } from '../../shared/components/hero/hero.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { WhatsappButtonComponent } from '../../shared/components/whatsapp-button/whatsapp-button.component';

@Component({
  selector: 'app-home',
  imports: [
    FeaturedShelvesComponent,
    FiltersBarComponent,
    HeroComponent,
    NavbarComponent,
    WhatsappButtonComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
