import { Component } from '@angular/core';
import { SinglePost, User } from '../../interfaces/products';
import { ProductsService } from '../../services/products.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-single-post',
  standalone: false,
  templateUrl: './single-post.component.html',
  styleUrl: './single-post.component.scss',
})
export class SinglePostComponent {
  post!: Observable<SinglePost>;
  user!:Observable<User>

  constructor(
    private postService: ProductsService,
    private activtedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getPost();
    this.getUser();
  }

  getPost() {
    this.post = this.postService.getSinglePostData();
  }

  getUser(){
    this.user = this.postService.getUserData();
  }
}
