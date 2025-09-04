import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

interface AuthResponse {
  message: string;
  Id?: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  private currentUserId = new BehaviorSubject<string | null>(this.getUserId());
  
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  currentUserId$ = this.currentUserId.asObservable();

  constructor(private api: ApiService, private router: Router) {
    // Check token on service initialization
    this.checkAuthStatus();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('userId');
  }

   getUserId(): any | null {
    return localStorage.getItem('userId');
  }

  private checkAuthStatus(): void {
    if (this.hasToken()) {
      this.isAuthenticatedSubject.next(true);
      this.currentUserId.next(this.getUserId());
    } else {
      this.isAuthenticatedSubject.next(false);
      this.currentUserId.next(null);
    }
  }

  register(userData: RegisterData): Observable<AuthResponse> {
    return this.api.postRequest<AuthResponse>('auth/register', userData);
  }

  login(credentials: LoginData): Observable<AuthResponse> {
    return this.api.postRequest<AuthResponse>('auth/login', credentials).pipe(
      tap((response) => {
        if (response && response.Id) {
          localStorage.setItem('userId', response.Id);
          this.isAuthenticatedSubject.next(true);
          this.currentUserId.next(response.Id);
        }
      })
    );
  }

  logout(): Observable<AuthResponse> {
    return this.api.postRequest<AuthResponse>('auth/logout', {}).pipe(
      tap(() => {
        localStorage.removeItem('userId');
        this.isAuthenticatedSubject.next(false);
        this.currentUserId.next(null);
        this.router.navigate(['/']);
      })
    );
  }

  getCurrentUserId(): string | null {
    return this.getUserId();
  }
}