import { Injectable } from '@angular/core';

import { Movie } from '../../models/movie.model';

@Injectable({
  providedIn: 'root',
})
export class WhatsappService {
  buildMovieMessage(movie: Movie): string {
    return `Hola, quiero informacion sobre ${movie.title}.`;
  }

  buildContactUrl(message: string): string {
    const params = new URLSearchParams({ text: message });

    return `https://wa.me/?${params.toString()}`;
  }
}
