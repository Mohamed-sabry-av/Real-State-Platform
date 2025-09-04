import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-slider',
  standalone: false,
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
})
export class SliderComponent implements OnInit {
  @Input() images: string[] = [];

  absoluteImages: string[] = [];
  currentImage: string = '';
  showFullSlider: boolean = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.absoluteImages = this.images.map(img => this.getImageUrl(img));
    this.setupImagesSlider();
  }
  
  getImageUrl(imagePath: string): string {
    if (!imagePath) return `${this.apiService.api}/images/default-property.jpg`;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/')) {
      return `${this.apiService.api}${imagePath}`;
    }
    return `${this.apiService.api}/${imagePath}`;
  }

  setupImagesSlider() {
    if (this.absoluteImages && this.absoluteImages.length > 0) {
      this.currentImage = this.absoluteImages[0];
    }
  }

  changeImage(img: string) {
    this.currentImage = img;
  }

  showNextImage() {
    const currentIndex = this.absoluteImages.indexOf(this.currentImage);
    const nextIndex = (currentIndex + 1) % this.absoluteImages.length;
    this.currentImage = this.absoluteImages[nextIndex];
  }

  showPrevImage() {
    const currentIndex = this.absoluteImages.indexOf(this.currentImage);
    const prevIndex = (currentIndex - 1 + this.absoluteImages.length) % this.absoluteImages.length;
    this.currentImage = this.absoluteImages[prevIndex];
  }

  openSlider() {
    this.showFullSlider = true;
  }

  closeSlider() {
    this.showFullSlider = false;
  }
}
