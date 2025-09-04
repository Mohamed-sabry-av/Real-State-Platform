import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  api: string = 'http://localhost:3000';

  constructor(private HttpClient: HttpClient) {}

  getRequest<T>(url: string, params?: any) {
    return this.HttpClient.get<T>(`${this.api}/${url}`, { params, withCredentials: true });
  }
  postRequest<T>(url: string, body: any) {
    return this.HttpClient.post<T>(`${this.api}/${url}`, body, { withCredentials: true });
  }
  updateRequest<T>(url: string, body: any) {
    return this.HttpClient.put<T>(`${this.api}/${url}`, body, { withCredentials: true });
  }
  deleteRequest<T>(url: string, body?: any) {
    return this.HttpClient.delete<T>(`${this.api}/${url}`, { body, withCredentials: true });
  }
}
