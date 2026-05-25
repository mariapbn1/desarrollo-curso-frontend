import { Component, EventEmitter, Input, Output } from '@angular/core';

import { MovieFilters } from '../../../models/movie-filter.model';

@Component({
  selector: 'app-filters-bar',
  imports: [],
  templateUrl: './filters-bar.component.html',
  styleUrl: './filters-bar.component.scss',
})
export class FiltersBarComponent {
  @Input() genres: readonly string[] = [];
  @Input() years: readonly string[] = [];
  @Input() formats: readonly string[] = [];
  @Output() readonly filtersChange = new EventEmitter<MovieFilters>();

  private filters: MovieFilters = {};

  updateFilter(filterName: keyof MovieFilters, event: Event): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    const value = target.value.trim();

    this.filters = {
      ...this.filters,
      [filterName]: value || undefined,
    };
    this.filtersChange.emit(this.filters);
  }

  clearFilters(): void {
    this.filters = {};
    this.filtersChange.emit(this.filters);
  }
}
