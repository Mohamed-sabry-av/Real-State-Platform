import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { HomeComponent } from './pages/home/home.component';
import { ListComponent } from './pages/list/list.component';
import { FilterComponent } from './components/filter/filter.component';
import { CardComponent } from './components/card/card.component';
import { MapComponent } from './components/map/map.component';
import { SinglePostComponent } from './pages/single-post/single-post.component';
import { SliderComponent } from './components/slider/slider.component';
import { FullSliderComponent } from './components/full-slider/full-slider.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { CreatePostComponent } from './pages/create-post/create-post.component';
import { ProfileComponent } from './pages/profile/profile.component';

// Services
import { AuthService } from './services/auth.service';
import { ApiService } from './services/api.service';
import { PostsService } from './services/posts.service';
import { UsersService } from './services/users.service';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { EditPostComponent } from './pages/edit-post/edit-post.component';
// import { ChatComponent } from './components/chat/chat.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SearchbarComponent,
    HomeComponent,
    ListComponent,
    FilterComponent,
    CardComponent,
    MapComponent,
    SinglePostComponent,
    SliderComponent,
    FullSliderComponent,
    LoginComponent,
    RegisterComponent,
    CreatePostComponent,
    EditPostComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule, 
    AppRoutingModule, 
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatSnackBarModule,
    ReactiveFormsModule
  ],
  providers: [
    provideHttpClient(),
    AuthService,
    ApiService,
    PostsService,
    UsersService,
    AuthGuard
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
