import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Apartment, SinglePost } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(private api: ApiService) {}

  getPosts(params?: any): Observable<any> {
    // Clean up empty parameters
    if (params) {
      const cleanParams: any = {};
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          cleanParams[key] = params[key];
        }
      });
      return this.api.getRequest<any>('post', cleanParams);
    }
    
    return this.api.getRequest<any>('post');
  }

  getSinglePost(id: string): Observable<SinglePost> {
    return this.api.getRequest<SinglePost>(`post/${id}`);
  }

  createPost(postData: FormData): Observable<SinglePost> {
    return this.api.postRequest<SinglePost>('post', postData);
  }

  updatePost(id: string, postData: FormData): Observable<SinglePost> {
    return this.api.updateRequest<SinglePost>(`post/${id}`, postData);
  }

  deletePost(id: string): Observable<any> {
    return this.api.deleteRequest<any>(`post/${id}`, {});
  }

  
}
