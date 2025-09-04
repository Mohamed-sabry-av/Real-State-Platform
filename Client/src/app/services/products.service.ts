import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Define interfaces for type safety
// 


interface User {
  id: number;
  name: string;
  img: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

}