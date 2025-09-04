import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FilterService {
    constructor(private apiService:ApiService) {}

    getFilterOptions(): Observable<any> {
        return this.apiService.getRequest('post/filter-options');
    }
}