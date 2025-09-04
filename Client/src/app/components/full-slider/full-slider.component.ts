import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-full-slider',
  standalone: false,
  templateUrl: './full-slider.component.html',
  styleUrl: './full-slider.component.scss',
})
export class FullSliderComponent {
  @Input() image: string = '';
  @Input() next: () => void = () => {};
  @Input() prev: () => void = () => {};

  @Output() close = new EventEmitter();

  onClose() {
    this.close.emit();
  }
}
