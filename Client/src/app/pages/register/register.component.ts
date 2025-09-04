import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
    standalone:false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerData = {
    name: '',
    email: '',
    password: ''
  };
  confirmPassword: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    // Validate passwords match
    if (this.registerData.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.isLoading = false;
        // Navigate to login with success message
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.error || 'Registration failed. Please try again.';
      }
    });
  }
}