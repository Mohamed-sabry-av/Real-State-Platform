import { Component, OnInit } from '@angular/core'; // أضف OnInit
import { Apartment } from '../../interfaces/interfaces';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-list',
  standalone: false,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit { // أضف OnInit
  apartments: Apartment[] = [];
  loading = false;
  currentFilters: any = {};

  constructor(private postService: PostsService) {}

  ngOnInit() {
    this.getAllPosts();
  }

  // تحديث الدالة لقبول الفلاتر
  getAllPosts(filters?: any) {
    this.loading = true;
    this.currentFilters = filters || {};
    
    this.postService.getPosts(filters).subscribe({
      next: (response: any) => {
        // التعامل مع الاستجابة سواء كانت مع pagination أو بدون
        if (response && Array.isArray(response.posts)) {
          // إذا كانت البيانات مع pagination
          this.apartments = response.posts;
        } else if (Array.isArray(response)) {
          // إذا كانت البيانات مباشرة
          this.apartments = response;
        } else {
          this.apartments = [];
        }
        
        this.loading = false;
        console.log('Loaded apartments:', this.apartments.length);
      },
      error: (error) => {
        console.error('Error fetching posts:', error);
        this.apartments = [];
        this.loading = false;
      }
    });
  }

  // دالة للاستماع لتغييرات الفلاتر
  onFiltersChanged(filters: any) {
    console.log('Filters applied:', filters);
    this.getAllPosts(filters);
  }
}