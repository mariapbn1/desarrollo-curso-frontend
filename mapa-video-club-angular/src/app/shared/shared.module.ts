import { NgModule } from '@angular/core';

import { CartModalComponent } from './components/cart-modal/cart-modal.component';
import { FeaturedShelvesComponent } from './components/featured-shelves/featured-shelves.component';
import { FiltersBarComponent } from './components/filters-bar/filters-bar.component';
import { HeroComponent } from './components/hero/hero.component';
import { MovieCardComponent } from './components/movie-card/movie-card.component';
import { MovieCarouselComponent } from './components/movie-carousel/movie-carousel.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { WhatsappButtonComponent } from './components/whatsapp-button/whatsapp-button.component';

const SHARED_COMPONENTS = [
  CartModalComponent,
  FeaturedShelvesComponent,
  FiltersBarComponent,
  HeroComponent,
  MovieCardComponent,
  MovieCarouselComponent,
  NavbarComponent,
  WhatsappButtonComponent,
];

@NgModule({
  imports: SHARED_COMPONENTS,
  exports: SHARED_COMPONENTS,
})
export class SharedModule {}
