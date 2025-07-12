import { Component, Input, OnInit } from '@angular/core';
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
export class MapComponent implements OnInit {
  @Input() apartments: Apartment[] = [];
  map!: L.Map;
  markersLayer!: L.LayerGroup;

  ngOnInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map').setView([0, 0], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 13,
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

    this.markersLayer = L.layerGroup().addTo(this.map);
    this.addAllMarkers();
  }

  private addAllMarkers() {
    if (!this.apartments || this.apartments.length === 0) {
      return;
    }
    const markers: L.Marker[] = [];
    const validApartments: Apartment[] = [];

    this.apartments.forEach((apartment) => {
      const lat = apartment.latitude;
      const lng = apartment.longitude;

      if (lat && lng) {
        const marker = L.marker([lat, lng])
          .bindPopup(this.createPopupContent(apartment))
          .addTo(this.markersLayer);

        markers.push(marker);
        validApartments.push(apartment);
      }
    });

    if (markers.length > 0) {
      const group = L.featureGroup(markers);
      this.map.fitBounds(group.getBounds(), { padding: [20, 20] });
    }

    // L.marker([lat!, lng!])
    //   .addTo(this.map)
    //   .bindPopup('Default Location')
    //   .openPopup();
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
