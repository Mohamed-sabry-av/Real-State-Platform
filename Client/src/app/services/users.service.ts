import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { User, SinglePost } from "../interfaces/interfaces";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private api: ApiService) {}

  getUser(id: string): Observable<User> {
    return this.api.getRequest<User>(`user/${id}`);
  }

  getUserProfile(): Observable<any> {
    return this.api.getRequest<any>('user/profilePosts');
  }

  getNotifications(): Observable<any> {
    return this.api.getRequest<any>('user/notification');
  }

  updateUser(id: string, userData: FormData): Observable<User> {
    // Ensure witshCredentials is set for this specific request
    return this.api.updateRequest<User>(`user/${id}`, userData);
  }

  savePost(postId: string): Observable<any> {
    return this.api.postRequest<any>(`user/save/${postId}`, {});
  }

  getSavedPosts(): Observable<SinglePost[]> {
    return this.api.getRequest<SinglePost[]>('user/savedPosts');
  }
}