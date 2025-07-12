import { Component } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Apartment } from '../../interfaces/products';

@Component({
  selector: 'app-list',
  standalone: false,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  apartments: Apartment[] = [];
  constructor(private productsService: ProductsService) {}

  ngOnInit() {
    this.getAllProducts();
  }

  getAllProducts() {
    this.apartments = this.productsService.getListData();
    console.log(this.apartments);
  }
}
