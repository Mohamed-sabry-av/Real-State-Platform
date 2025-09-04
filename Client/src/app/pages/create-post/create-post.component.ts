import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostsService } from '../../services/posts.service';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-post',
    standalone:false,
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {
  postData = {
    title: '',
    price: null,
    description: '',
    category: '',
    address: '',
    city: '',
    bedroom: null,
    bathroom: null,
    latitude: null,
    longitude: null,
    propertyType: '',
    type: 'rent', // Default type
    postDetail: {
      desc: '',
      utilities: '',
      pet: '',
      income: null,
      size: null,
      school: '',
      bus: ''
    }
  };

  selectedImages: File[] = [];
  imagePreviewUrls: string[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;
  categories = ['apartment', 'house', 'condo', 'villa', 'office'];
  propertyTypes = ['residential', 'commercial'];
  postTypes = ['rent', 'buy'];
  petPolicyOptions = ['Not Allowed', 'Cats Only', 'Dogs Only', 'Cats & Dogs', 'Case by Case'];
  utilitiesOptions = [
    { name: 'Water', icon: 'fa-tint', checked: false },
    { name: 'Electricity', icon: 'fa-bolt', checked: false },
    { name: 'Gas', icon: 'fa-fire', checked: false },
    { name: 'Internet', icon: 'fa-wifi', checked: false },
    { name: 'Cable TV', icon: 'fa-tv', checked: false },
    { name: 'Heating', icon: 'fa-temperature-high', checked: false },
    { name: 'Air Conditioning', icon: 'fa-snowflake', checked: false }
  ];
  
  // Map related properties
  initialLatitude: number = 40.7128; // Default to New York
  initialLongitude: number = -74.0060;

  constructor(
    private router: Router,
    private postsService: PostsService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit(): void {
    // Try to get user's location for the map
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.initialLatitude = position.coords.latitude;
          this.initialLongitude = position.coords.longitude;
          
          // Set initial values for the form
          this.postData.latitude = this.initialLatitude as unknown as null;
          this.postData.longitude = this.initialLongitude as unknown as null;
        },
        (error) => {
          console.error('Error getting location:', error);
          // Keep default coordinates
        }
      );
    }
  }

  onImagesSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      const newFiles = Array.from(event.target.files) as File[];
      if (this.selectedImages.length + newFiles.length > 5) {
        this.errorMessage = 'You can upload a maximum of 5 images';
        return;
      }
      this.selectedImages = [...this.selectedImages, ...newFiles];
      this.updateImagePreviewUrls();
      this.errorMessage = '';
    }
  }

  removeImage(index: number): void {
    this.selectedImages.splice(index, 1);
    this.updateImagePreviewUrls();
  }

  updateImagePreviewUrls(): void {
    // Revoke old URLs
    this.imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    this.imagePreviewUrls = this.selectedImages.map(file => URL.createObjectURL(file));
  }

  getImagePreviewUrl(file: File, index: number): string {
    return this.imagePreviewUrls[index] || '';
  }
  onMarkerDragEnd(event: any): void {
    // Update form with new coordinates
    this.postData.latitude = event.lat as unknown as null;
    this.postData.longitude = event.lng as unknown as null;
  }
  
  getSelectedUtilities(): string {
    return this.utilitiesOptions
      .filter(option => option.checked)
      .map(option => option.name)
      .join(', ');
  }

  onSubmit(): void {
    if (this.selectedImages.length === 0) {
      this.errorMessage = 'Please select at least one image for your property';
      return;
    }

    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formData = new FormData();
    
    // Add basic post data
    Object.keys(this.postData).forEach(key => {
      if (key !== 'postDetail') {
        formData.append(key, (this.postData as any)[key]);
      }
    });

    // Process utilities
    this.postData.postDetail.utilities = this.getSelectedUtilities();
    
    // Add post detail as JSON string
    formData.append('postDetail', JSON.stringify(this.postData.postDetail));
    
    // Add multiple image files
    this.selectedImages.forEach((image, index) => {
      formData.append('images', image);
    });

    this.postsService.createPost(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/post', response._id]);
      },
      error: (error) => {
        this.isLoading = false;
        this.showToast(error.error?.message || 'Failed to create post. Please try again.');
      }
    });
  }

  validateForm(): boolean {
    // Required fields validation
    const requiredFields = ['title', 'price', 'description', 'category', 'address', 'city', 'bedroom', 'bathroom'];
    for (const field of requiredFields) {
      if (!(this.postData as any)[field]) {
        this.errorMessage = `Please fill in the ${field} field`;
        return false;
      }
    }

    // Required postDetail fields validation
    if (!this.postData.postDetail.desc) {
      this.errorMessage = 'Please provide a description in the details section';
      return false;
    }

    // Validate coordinates
    if (!this.postData.latitude || !this.postData.longitude) {
      this.errorMessage = 'Please provide valid coordinates for the property location';
      return false;
    }

    return true;
  }

  // Helper method to set coordinates (could be connected to a map component)
  setCoordinates(lat: any, lng: any): void {
    this.postData.latitude = lat as unknown as null;
    this.postData.longitude = lng as unknown as null;
  }
  showToast(message: string, action: string = 'Close', duration: number = 3000) {
    this.snackBar.open(message, action, { duration });
  }
}