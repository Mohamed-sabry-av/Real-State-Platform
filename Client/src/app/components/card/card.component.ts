import { Component, Input, OnInit } from '@angular/core';
import { Apartment } from '../../interfaces/interfaces';
import { ApiService } from '../../services/api.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-card',
  standalone: false,
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent implements OnInit {
  @Input() apartment: Apartment | undefined;
  
  constructor(private apiService: ApiService, private userService: UsersService) {}
  
  ngOnInit(): void {
    // Initialize component
  }
  
  getImageUrl(imagePath: string): string {
    if (!imagePath) return '/images/default-property.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/')) {
      return `${this.apiService.api}${imagePath}`;
    }
    return `${this.apiService.api}/${imagePath}`;
  }

  savePost(postId:string):void{
    this.userService.savePost(postId).subscribe({
      next: (response) => {
        console.log('Post saved successfully:', response);
      },
      error: (error) => {
        console.error('Error saving post:', error);
      }
    })
  }
}
