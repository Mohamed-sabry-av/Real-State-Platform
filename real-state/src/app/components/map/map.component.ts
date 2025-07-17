import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon paths
import { icon, Marker } from 'leaflet';

const DefaultIcon = icon({
  iconUrl: 'map/marker-icon.png',
  shadowUrl: 'map/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;
import { info, Apartment } from '../../interfaces/products';

@Component({
  selector: 'app-map',
  standalone: false,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  @Input() apartments: Apartment[] = [];
  @Input() latitude?: number;
  @Input() longitude?: number;

  map!: L.Map;
  markersLayer!: L.LayerGroup;

   ngAfterViewInit(): void {
    this.initMap();
  }
  // ngOnInit(): void {
  //   this.initMap();
  // }

  private initMap(): void {
    this.map = L.map('map').setView([0, 0], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 13,
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

    this.markersLayer = L.layerGroup().addTo(this.map);

    if (this.latitude !== undefined && this.longitude !== undefined) {
      this.addSingleMarker(this.latitude, this.longitude);
    } else {
      this.addAllMarkers();
    }
  }

  addSingleMarker(lat: number, lng: number) {
    const marker = L.marker([lat, lng])
      .addTo(this.markersLayer)
      .bindPopup('Location')
      .openPopup();

    this.map.setView([lat, lng]);
  }

 private addAllMarkers() {
    if (!this.apartments || this.apartments.length === 0) {
      return;
    }
    const markers: L.Marker[] = [];
    this.apartments.forEach((apartment) => {
      const lat = apartment.latitude;
      console.log(lat)
      const lng = apartment.longitude;
      if (lat && lng) {
        const marker = L.marker([lat, lng])
          .bindPopup(this.createPopupContent(apartment))
          .addTo(this.markersLayer);
        markers.push(marker);
      }
    });

    if (markers.length > 0) {
      const group = L.featureGroup(markers);
      this.map.fitBounds(group.getBounds(), { padding: [20, 20] });
    }
  }


  private createPopupContent(apartment: Apartment): string {
    return `
    <div class="popup-content">
        <img src="${apartment.img}" class="popup-img" alt="${apartment.title}" />
        <div class="textContainer">
        <h3 class="popup-title">${apartment.title} , ${apartment.bedroom} bedrooms</h3>
        <p class="popup-price">$${apartment.price}</p>
        </div>
      </div>`;
  }
}
