import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

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
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
