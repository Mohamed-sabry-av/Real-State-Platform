import { Component, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-slider',
  standalone: false,
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
})
export class SliderComponent {
  @Input() images: string[] = [];

  currentImage: string = '';
  showFullSlider: boolean = false;

  ngOnInit() {
    this.setupImagesSlider();
  }

  setupImagesSlider() {
    if (this.images && this.images.length > 0) {
      this.currentImage = this.images[0];
    }
  }

  changeImage(img: string) {
    this.currentImage = img;
  }

  showNextImage() {
    const currentIndex = this.images.indexOf(this.currentImage);
    const nextIndex = (currentIndex + 1) % this.images.length;
    this.currentImage = this.images[nextIndex];
  }

  showPrevImage() {
    const currentIndex = this.images.indexOf(this.currentImage);
    const prevIndex =
      (currentIndex - 1 + this.images.length) % this.images.length;
    this.currentImage = this.images[prevIndex];
  }

  openSlider() {
    this.showFullSlider = true;
  }

  closeSlider() {
    this.showFullSlider = false;
  }
}
