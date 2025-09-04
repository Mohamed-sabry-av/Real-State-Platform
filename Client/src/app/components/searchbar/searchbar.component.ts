import { Component } from '@angular/core';

@Component({
  selector: 'app-searchbar',
  standalone:false,
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent {
  types = ['buy', 'rent'];
  query = {
    type: 'buy',
    location: '',
    minPrice: 0,
    maxPrice: 0
  };

  switchType(type: string): void {
    this.query.type = type;
    // Class binding is handled in template with [ngClass]
  }
}