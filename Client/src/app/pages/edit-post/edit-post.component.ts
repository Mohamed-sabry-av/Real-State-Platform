import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService } from '../../services/posts.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-post',
  standalone: false,
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss'],
})
export class EditPostComponent implements OnInit {
  postId: string = '';
  isLoading = false;
  isSubmitting = false;
  
  // Simplified form data
  formData = {
    title: '',
    price: null,
    type: 'rent',
    category: '',
    propertyType: '',
    description: '',
    address: '',
    city: '',
     latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
    bedroom: null,
    bathroom: null,
    size: null,
    detailedDescription: '',
    utilities: '',
    petPolicy: ''
  };

  newImages: File[] = [];
  currentImages: string[] = [];
  
  // Options
  types = ['rent', 'buy'];
  categories = ['apartment', 'house', 'condo', 'villa'];
  propertyTypes = ['residential', 'commercial'];

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get('id') || '';
    if (this.postId) {
      this.loadPost();
    }
  }

  loadPost() {
    this.isLoading = true;
    this.postsService.getSinglePost(this.postId).subscribe({
      next: (post: any) => {
        // Map the post data to our simplified form
        this.formData = {
          title: post.title || '',
          price: post.price || null,
          type: post.type || 'rent',
          category: post.category || '',
          propertyType: post.propertyType || '',
          description: post.description || '',
          address: post.address || '',
          city: post.city || '',
          latitude: post.latitude || null,
          longitude: post.longitude || null,
          bedroom: post.bedroom || null,
          bathroom: post.bathroom || null,
          size: post.postDetail?.size || null,
          detailedDescription: post.postDetail?.desc || '',
          utilities: post.postDetail?.utilities || '',
          petPolicy: post.postDetail?.pet || ''
        };
        
        this.currentImages = post.images || [];
        this.isLoading = false;
      },
      error: (error) => {
        this.showMessage('Failed to load post data');
        this.isLoading = false;
      }
    });
  }

  onImagesSelected(event: any) {
    const files = Array.from(event.target.files) as File[];
    this.newImages = files;
  }

  onMapUpdate(coords: any) {
    this.formData.latitude = coords.lat;
    this.formData.longitude = coords.lng;
  }

  onSubmit() {
    if (!this.validateForm()) return;
    
    this.isSubmitting = true;
    const submitData = new FormData();
    
    // Add all form fields
    Object.keys(this.formData).forEach(key => {
      const value = (this.formData as any)[key];
      if (value !== null && value !== '') {
        submitData.append(key, value.toString());
      }
    });
    
    // Create postDetail object for backend compatibility
    const postDetail = {
      size: this.formData.size,
      desc: this.formData.detailedDescription,
      utilities: this.formData.utilities,
      pet: this.formData.petPolicy
    };
    submitData.append('postDetail', JSON.stringify(postDetail));
    
    // Add new images if any
    this.newImages.forEach(image => {
      submitData.append('images', image);
    });
    
    this.postsService.updatePost(this.postId, submitData).subscribe({
      next: () => {
        this.showMessage('Property updated successfully!');
        this.router.navigate(['/profile']);
      },
      error: () => {
        this.showMessage('Failed to update property');
        this.isSubmitting = false;
      }
    });
  }

  validateForm(): boolean {
    const required = ['title', 'price', 'type', 'category', 'propertyType', 'description', 'address', 'city', 'bedroom', 'bathroom'];
    
    for (const field of required) {
      if (!(this.formData as any)[field]) {
        this.showMessage(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    
    if (!this.formData.latitude || !this.formData.longitude) {
      this.showMessage('Please set the property location on the map');
      return false;
    }
    
    return true;
  }

  showMessage(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
}