import { Component, Input } from '@angular/core';
import { Apartment } from '../../interfaces/products';

@Component({
  selector: 'app-card',
  standalone: false,
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() apartment: Apartment | undefined;
}
