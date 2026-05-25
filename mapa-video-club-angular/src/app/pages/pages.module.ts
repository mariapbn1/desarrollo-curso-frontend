import { NgModule } from '@angular/core';

import { AuthComponent } from './auth/auth.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';

const PAGE_COMPONENTS = [
  AuthComponent,
  ContactComponent,
  HomeComponent,
  MovieDetailComponent,
];

@NgModule({
  imports: PAGE_COMPONENTS,
  exports: PAGE_COMPONENTS,
})
export class PagesModule {}
