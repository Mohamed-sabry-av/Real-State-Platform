// map.component.ts
import { AfterViewInit, Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon paths
import { icon, Marker } from 'leaflet';

const DefaultIcon = icon({
  iconUrl: '/map/marker-icon.png',
  shadowUrl: '/map/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const SelectedIcon = icon({
  iconUrl: '/map/marker-icon.png', // Add this for highlighting
  shadowUrl: '/map/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

import { Apartment } from '../../interfaces/interfaces';

@Component({
  selector: 'app-map',
  standalone: false,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() apartments: Apartment[] = [];
  @Input() latitude?: number;
  @Input() longitude?: number;
  @Input() draggable: boolean = false;
  @Input() selectedApartmentId?: string;
  @Input() loading: boolean = false;
  @Input() height: string = '100%';
  
  @Output() markerDragEnd = new EventEmitter<{lat: number, lng: number}>();
  @Output() apartmentClick = new EventEmitter<Apartment>();
  @Output() mapReady = new EventEmitter<L.Map>();

  map!: L.Map;
  markersLayer!: L.LayerGroup;
  marker!: L.Marker;
  apartmentMarkers: Map<string, L.Marker> = new Map();
  mapId = 'map-' + Math.random().toString(36).substr(2, 9);
  
  // Debug and error info
  debugInfo: any = {
    totalApartments: 0,
    validMarkers: 0,
    invalidMarkers: 0,
    invalidReasons: []
  };
  
  errorMessage: string = '';
  isMapReady: boolean = false;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMap();
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isMapReady) {
      if (changes['apartments']) {
        console.log('🔄 Apartments changed, updating markers');
        this.updateAllMarkers();
      }
      if (changes['selectedApartmentId']) {
        this.highlightSelectedApartment();
      }
      if (changes['latitude'] || changes['longitude']) {
        this.updateSingleMarker();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    try {
      // Set default center - you might want to change this based on your location
      const defaultLat = this.latitude || 40.7128; // New York City
      const defaultLng = this.longitude || -74.0060;
      
      this.map = L.map(this.mapId, {
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        touchZoom: true,
      }).setView([defaultLat, defaultLng], 10);

      // Add tile layer with error handling
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors',
      }).addTo(this.map);

      // Initialize marker layer
      this.markersLayer = L.layerGroup().addTo(this.map);

      // Handle map events
      this.map.on('load', () => {
        console.log('🗺️ Map loaded successfully');
      });

      this.map.on('error', (e) => {
        console.error('❌ Map error:', e);
        this.errorMessage = 'Map failed to load properly';
      });

      // Initialize markers based on current mode
      if (this.latitude !== undefined && this.longitude !== undefined) {
        this.addSingleMarker(this.latitude, this.longitude);
      } else if (this.apartments && this.apartments.length > 0) {
        this.updateAllMarkers();
      }

      this.isMapReady = true;
      this.mapReady.emit(this.map);

    } catch (error) {
      console.error('❌ Error initializing map:', error);
      this.errorMessage = 'Failed to initialize map. Please refresh the page.';
    }
  }

  private addSingleMarker(lat: number, lng: number): void {
    const parsedLat = this.parseCoordinate(lat);
    const parsedLng = this.parseCoordinate(lng);

    if (!this.isValidCoordinate(parsedLat, parsedLng)) {
      console.warn('⚠️ Invalid coordinates for single marker:', { lat, lng, parsedLat, parsedLng });
      this.errorMessage = 'Invalid coordinates provided';
      return;
    }

    // Clear existing markers
    this.clearMarkers();

    this.marker = L.marker([parsedLat, parsedLng], { 
      draggable: this.draggable,
      icon: this.draggable ? SelectedIcon : DefaultIcon
    })
      .addTo(this.markersLayer)
      .bindPopup(this.draggable ? 'Drag me to set location' : 'Property Location')
      .openPopup();

    if (this.draggable) {
      this.marker.on('dragend', (event) => {
        const marker = event.target;
        const position = marker.getLatLng();
        this.markerDragEnd.emit({
          lat: Number(position.lat.toFixed(6)),
          lng: Number(position.lng.toFixed(6))
        });
      });
    }

    this.map.setView([parsedLat, parsedLng], 15);
  }

  private updateSingleMarker(): void {
    if (this.latitude !== undefined && this.longitude !== undefined) {
      this.addSingleMarker(this.latitude, this.longitude);
    }
  }

  private updateAllMarkers(): void {
    if (!this.apartments || this.apartments.length === 0) {
      console.log('📍 No apartments to show on map');
      this.clearMarkers();
      return;
    }

    console.log(`📍 Processing ${this.apartments.length} apartments for map display`);
    
    // Reset debug info
    this.debugInfo = {
      totalApartments: this.apartments.length,
      validMarkers: 0,
      invalidMarkers: 0,
      invalidReasons: []
    };

    this.clearMarkers();
    const validMarkers: L.Marker[] = [];

    this.apartments.forEach((apartment, index) => {
      const lat = this.parseCoordinate(apartment.latitude);
      const lng = this.parseCoordinate(apartment.longitude);
      
      console.log(`🏠 Apartment ${index + 1} [${apartment.title}]:`, {
        originalLat: apartment.latitude,
        originalLng: apartment.longitude,
        parsedLat: lat,
        parsedLng: lng,
        valid: this.isValidCoordinate(lat, lng)
      });

      if (this.isValidCoordinate(lat, lng)) {
        const marker = this.createApartmentMarker(apartment, lat, lng);
        validMarkers.push(marker);
        this.apartmentMarkers.set(apartment._id, marker);
        this.debugInfo.validMarkers++;
      } else {
        this.debugInfo.invalidMarkers++;
        const reason = this.getInvalidReason(lat, lng, apartment);
        this.debugInfo.invalidReasons.push(`${apartment.title}: ${reason}`);
        console.warn(`⚠️ Invalid coordinates for ${apartment.title}:`, {
          lat: apartment.latitude,
          lng: apartment.longitude,
          reason
        });
      }
    });

    console.log('📊 Marker Summary:', this.debugInfo);

    if (validMarkers.length === 0) {
      this.errorMessage = `No properties found with valid coordinates. ${this.debugInfo.invalidMarkers} properties have location issues.`;
      console.warn('❌ No valid markers found!');
      return;
    }

    // Fit map to show all valid markers
    try {
      const group = L.featureGroup(validMarkers);
      this.map.fitBounds(group.getBounds(), { 
        padding: [20, 20],
        maxZoom: 15
      });
      
      this.errorMessage = this.debugInfo.invalidMarkers > 0 ? 
        `Showing ${this.debugInfo.validMarkers} properties. ${this.debugInfo.invalidMarkers} properties have invalid locations.` : 
        '';
        
    } catch (error) {
      console.error('❌ Error fitting bounds:', error);
      this.errorMessage = 'Error displaying property locations';
    }
  }

  private createApartmentMarker(apartment: Apartment, lat: number, lng: number): L.Marker {
    const isSelected = apartment._id === this.selectedApartmentId;
    
    const marker = L.marker([lat, lng], {
      icon: isSelected ? SelectedIcon : DefaultIcon,
      title: apartment.title
    }).bindPopup(this.createPopupContent(apartment));

    // Add click event
    marker.on('click', () => {
      console.log('🖱️ Marker clicked:', apartment.title);
      this.apartmentClick.emit(apartment);
    });

    marker.addTo(this.markersLayer);
    return marker;
  }

  private highlightSelectedApartment(): void {
    this.apartmentMarkers.forEach((marker, id) => {
      const isSelected = id === this.selectedApartmentId;
      marker.setIcon(isSelected ? SelectedIcon : DefaultIcon);
      
      if (isSelected) {
        const position = marker.getLatLng();
        this.map.setView(position, Math.max(this.map.getZoom(), 15));
        marker.openPopup();
      }
    });
  }

  private clearMarkers(): void {
    this.apartmentMarkers.clear();
    this.markersLayer.clearLayers();
  }

  private parseCoordinate(coord: any): number {
    if (coord === null || coord === undefined || coord === '') {
      return NaN;
    }
    
    if (typeof coord === 'string') {
      const parsed = parseFloat(coord.trim());
      return parsed;
    }
    
    return Number(coord);
  }

  private isValidCoordinate(lat: number, lng: number): boolean {
    return !isNaN(lat) && 
           !isNaN(lng) && 
           isFinite(lat) && 
           isFinite(lng) &&
           lat >= -90 && 
           lat <= 90 && 
           lng >= -180 && 
           lng <= 180 &&
           !(lat === 0 && lng === 0); // Exclude null island unless specifically needed
  }

  private getInvalidReason(lat: number, lng: number, apartment: Apartment): string {
    if (isNaN(lat) || isNaN(lng)) {
      return 'Coordinates are not numbers';
    }
    if (!isFinite(lat) || !isFinite(lng)) {
      return 'Coordinates are infinite';
    }
    if (lat < -90 || lat > 90) {
      return 'Latitude out of range (-90 to 90)';
    }
    if (lng < -180 || lng > 180) {
      return 'Longitude out of range (-180 to 180)';
    }
    if (lat === 0 && lng === 0) {
      return 'Coordinates are at null island (0,0)';
    }
    return 'Unknown coordinate issue';
  }

  private createPopupContent(apartment: Apartment): string {
    const imageUrl = this.getApartmentImageUrl(apartment);
    const priceFormatted = apartment.price ? 
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      }).format(apartment.price) : 'Price not available';
    
    return `
      <div class="popup-content">
        <img src="${imageUrl}" class="popup-img" alt="${apartment.title}" 
             onerror="this.src='/images/placeholder.png'" />
        <div class="textContainer">
          <h3 class="popup-title">${apartment.title}</h3>
          <p class="popup-details">${apartment.bedroom || 0} bed • ${apartment.bathroom || 0} bath</p>
          <p class="popup-price">${priceFormatted}</p>
          ${apartment.address ? `<p class="popup-address">${apartment.address}</p>` : ''}
        </div>
      </div>`;
  }

  private getApartmentImageUrl(apartment: Apartment): string {
    if (Array.isArray(apartment.images) && apartment.images.length > 0) {
      const image = apartment.images[0];
      return image.startsWith('http') ? image : `http://localhost:3000${image}`;
    }
    if (typeof apartment.images === 'string' && apartment.images.length > 0) {
      return apartment.images.startsWith('http') ? 
        apartment.images : `http://localhost:3000${apartment.images}`;
    }
    return '/images/placeholder.png';
  }

  // Public methods for external control
  public focusOnApartment(apartmentId: string): void {
    const marker = this.apartmentMarkers.get(apartmentId);
    if (marker) {
      const position = marker.getLatLng();
      this.map.setView(position, 16);
      marker.openPopup();
    }
  }

  public refreshMarkers(): void {
    if (this.isMapReady) {
      this.updateAllMarkers();
    }
  }

  public getDebugInfo(): any {
    return this.debugInfo;
  }
}