import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { User, SinglePost } from '../../interfaces/interfaces';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  userId: string | null = null;
  user: User | null = null;
  userPosts: any[] = [];
  savedPostIds: string[] = [];
  savedPosts: SinglePost[] = [];
  isLoading: boolean = true;
  isLoadingSaved: boolean = false;
  isUpdating: boolean = false;
  errorMessage: string = '';
  selectedTab: 'posts' | 'saved' | 'edit' = 'posts';

  // Profile update form data
  profileData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  // Profile image
  selectedImage: File | any = null;
  imagePreviewUrl: string = '';

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getCurrentUserId();
    if (this.userId) {
      this.loadUserData();
      this.loadUserProfile();
    }
  }

  loadUserData(): void {
    if (!this.userId) return;

    this.usersService.getUser(this.userId).subscribe({
      next: (userData) => {
        this.user = userData;
        this.profileData.name = userData.name;
        this.profileData.email = userData.email;

        // Set avatar preview if available
        if (userData.avatar) {
          this.imagePreviewUrl = this.getImageUrl(userData.avatar);
        }

        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load user data';
        this.isLoading = false;
        console.error('Error loading user data:', error);
      },
    });
  }

  loadUserProfile(): void {
    this.usersService.getUserProfile().subscribe({
      next: (profileData) => {
        this.userPosts = profileData.userPosts || [];
        this.savedPostIds = profileData.savedPosts || [];
      },
      error: (error) => {
        console.error('Error loading profile data:', error);
      },
    });
  }

  loadSavedPosts(): void {
    if (this.savedPosts.length > 0 || this.isLoadingSaved) return;

    this.isLoadingSaved = true;
    this.usersService.getSavedPosts().subscribe({
      next: (posts) => {
        this.savedPosts = posts;
        this.isLoadingSaved = false;
      },
      error: (error) => {
        console.error('Error loading saved posts:', error);
        this.isLoadingSaved = false;
      },
    });
  }

  onImageSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedImage = event.target.files[0];
      this.imagePreviewUrl = URL.createObjectURL(this.selectedImage);
    }
  }

  removeImage(): void {
    this.selectedImage = null;
    if (this.user?.avatar) {
      // Keep the existing avatar preview
      this.imagePreviewUrl = this.getImageUrl(this.user.avatar);
    } else {
      this.imagePreviewUrl = '';
    }
  }

  updateProfile(): void {
    if (!this.userId) return;

    // Validate password match if provided
    if (
      this.profileData.password &&
      this.profileData.password !== this.profileData.confirmPassword
    ) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.isUpdating = true;
    this.errorMessage = '';

    const formData = new FormData();
    formData.append('name', this.profileData.name);
    formData.append('email', this.profileData.email);

    if (this.profileData.password) {
      formData.append('password', this.profileData.password);
    }

    if (this.selectedImage) {
      formData.append('avatar', this.selectedImage);
      this.selectedImage = null;
    }

    this.usersService.updateUser(this.userId, formData).subscribe({
      next: (updatedUser) => {
        this.isUpdating = false;
        this.user = updatedUser;
        this.showToast('Profile updated successfully');

        // Reset password fields after successful update
        this.profileData.password = '';
        this.profileData.confirmPassword = '';
      },
      error: (error) => {
        this.isUpdating = false;
        this.errorMessage = error.error?.message || 'Failed to update profile';
        console.error('Error updating profile:', error);
      },
    });
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) return '/images/default-avatar.svg';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/')) {
      return `${this.apiService.api}${imagePath}`;
    }
    return `${this.apiService.api}/${imagePath}`;
  }

  changeTab(tab: 'posts' | 'saved' | 'edit'): void {
    this.selectedTab = tab;
    if (tab === 'saved') {
      this.loadSavedPosts();
    }
  }
savePost(postId:string):void{
    this.usersService.savePost(postId).subscribe({
      next: (response) => {
        console.log('Post saved successfully:', response);
      },
      error: (error) => {
        console.error('Error saving post:', error);
      }
    })
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        // Navigation is handled in the auth service
      },
      error: (error) => {
        console.error('Error logging out:', error);
      },
    });
  }

  private showToast(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
