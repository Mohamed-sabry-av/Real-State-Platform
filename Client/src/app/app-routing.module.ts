import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ListComponent } from './pages/list/list.component';
import { SinglePostComponent } from './pages/single-post/single-post.component';
import { CreatePostComponent } from './pages/create-post/create-post.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';
import { EditPostComponent } from './pages/edit-post/edit-post.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'list', component: ListComponent },
  { path: 'post/:id', component: SinglePostComponent },
  { path: 'create-post', component: CreatePostComponent, canActivate: [AuthGuard] },
  { path: 'edit-post/:id', component: EditPostComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
