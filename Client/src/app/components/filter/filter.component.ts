import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FilterService } from '../../services/filter.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-filter',
  standalone: false,
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent implements OnInit {
  @Output() filtersChanged = new EventEmitter<any>();
  
  filterOptions: any = {};
  filterForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private filterService: FilterService
  ) {
    this.filterForm = this.fb.group({
      city: [''],
      property: [''], // buy/rent
      type: [''], // apartment/house/condo/land
      minPrice: [''],
      maxPrice: [''],
      bedroom: ['']
    });
  }

  ngOnInit() {
    this.loadFilterOptions();
    this.setupFormListener();
  }

  loadFilterOptions() {
    this.filterService.getFilterOptions().subscribe({
      next: (options) => {
        this.filterOptions = options;
        console.log('Filter options loaded:', options);
      },
      error: (error) => {
        console.error('Error loading filter options:', error);
      }
    });
  }

  setupFormListener() {
    // Listen to form changes with debounce
    this.filterForm.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(filters => {
      this.applyFilters();
    });
  }

  applyFilters() {
    const formValues = this.filterForm.value;
    
    // Remove empty values
    const cleanFilters = Object.keys(formValues).reduce((acc: any, key) => {
      const value = formValues[key];
      if (value !== null && value !== undefined && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});

    console.log('Applying filters:', cleanFilters);
    this.filtersChanged.emit(cleanFilters);
  }

  onSearchClick() {
    this.applyFilters();
  }

  resetFilters() {
    this.filterForm.reset();
    this.filtersChanged.emit({});
  }

  getCurrentCity(): string {
    return this.filterForm.get('city')?.value || '';
  }
}