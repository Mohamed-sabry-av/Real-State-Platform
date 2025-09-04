import { Component } from '@angular/core';
import { SinglePost, User } from '../../interfaces/interfaces';
import { Observable, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService } from '../../services/posts.service';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-single-post',
  standalone: false,
  templateUrl: './single-post.component.html',
  styleUrl: './single-post.component.scss',
})
export class SinglePostComponent {
  post!: Observable<SinglePost>;
  user!: Observable<User>;
  postId!: string;
  isOwner: boolean = false;
  isAuthenticated: boolean = false;

  constructor(
    private postsService: PostsService,
    private usersService: UsersService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.authService.isAuthenticated$.subscribe((isAuth) => {
      this.isAuthenticated = isAuth;
    });

    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.postId = params['id'];
        this.getPost();
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  getPost() {
    this.post = this.postsService.getSinglePost(this.postId);
    this.post.subscribe((post) => {
      if (post && post.userId) {
        this.getUser(post.userId);

        // Check if current user is the owner of this post
        const currentUserId = this.authService.getCurrentUserId();
        this.isOwner = currentUserId === post.userId;
      }
    });
  }

  getUser(userId: string) {
    this.user = this.usersService.getUser(userId);
  }

  deletePost() {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postsService.deletePost(this.postId).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error deleting post:', error);
        },
      });
    }
  }

  editPost() {
    this.router.navigate(['/edit-post', this.postId]);
  }

  savePost() {
    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }

    this.usersService.savePost(this.postId).subscribe({
      next: (response) => {
        alert('Post saved successfully!');
      },
      error: (error) => {
        console.error('Error saving post:', error);
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
}
