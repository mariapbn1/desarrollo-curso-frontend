import { Routes } from '@angular/router';

import { AuthComponent } from './pages/auth/auth.component';
import { ContactComponent } from './pages/contact/contact.component';
import { HomeComponent } from './pages/home/home.component';
import { MovieDetailComponent } from './pages/movie-detail/movie-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'MAPA VIDEO CLUB',
  },
  {
    path: 'pelicula/:id',
    component: MovieDetailComponent,
    title: 'Detalle de pelicula | MAPA VIDEO CLUB',
  },
  {
    path: 'auth',
    component: AuthComponent,
    title: 'Acceso | MAPA VIDEO CLUB',
  },
  {
    path: 'contacto',
    component: ContactComponent,
    title: 'Contacto | MAPA VIDEO CLUB',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
