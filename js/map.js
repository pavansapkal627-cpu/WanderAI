/**
 * WanderAI - Interactive Map Cartography (Leaflet.js)
 * Sunset Explorer Ocean Style: Deep ocean background,
 * Tropical Teal (#20B8A6) markers, Sunset Coral (#FF8066) highlights,
 * Ocean Blue stays, and animated route lines.
 */

class WanderMap {
  constructor() {
    this.map = null;
    this.markersGroup = null;
    this.routePolyline = null;
    this.activeFilter = 'all';
    this.currentTileLayer = null;
    this.init();
  }

  init() {
    window.addEventListener('load', () => {
      this.initLeaflet();
    });
  }

  initLeaflet() {
    const mapElement = document.getElementById('interactiveMapContainer');
    if (!mapElement || typeof L === 'undefined') return;

    const initialCoords = window.WanderLocationService?.activeLocation?.coordinates || [35.0116, 135.7681];

    this.map = L.map('interactiveMapContainer', {
      zoomControl: false,
      attributionControl: false
    }).setView(initialCoords, 12);

    L.control.zoom({ position: 'topright' }).addTo(this.map);

    this.markersGroup = L.layerGroup().addTo(this.map);

    this.updateThemeTiles(window.WanderApp?.theme || 'dark');
    this.loadAllMarkers();
    this.setupEventListeners();

    if (window.WanderApp?.activeItinerary) {
      this.plotItinerary(window.WanderApp.activeItinerary);
    }
  }

  setupEventListeners() {
    document.querySelectorAll('.map-layer-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const layer = btn.getAttribute('data-map-layer');
        this.filterLayer(layer);
      });
    });
  }

  updateThemeTiles(theme) {
    if (!this.map || typeof L === 'undefined') return;

    if (this.currentTileLayer) {
      this.map.removeLayer(this.currentTileLayer);
    }

    // Voyager CartoDB tiles with dark ocean styling
    this.currentTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(this.map);
  }

  filterLayer(layer) {
    this.activeFilter = layer;

    document.querySelectorAll('.map-layer-btn').forEach(btn => {
      const isCurrent = btn.getAttribute('data-map-layer') === layer;
      btn.classList.toggle('bg-tropical-teal', isCurrent);
      btn.classList.toggle('text-ocean-deep', isCurrent);
      btn.classList.toggle('font-bold', isCurrent);
      btn.classList.toggle('bg-ocean-dark/90', !isCurrent);
      btn.classList.toggle('text-ocean-sky', !isCurrent);
    });

    this.loadAllMarkers();
  }

  loadAllMarkers() {
    if (!this.map || !this.markersGroup || typeof L === 'undefined') return;
    this.markersGroup.clearLayers();

    const data = window.WANDER_DATA;
    const app = window.WanderApp;

    const createCustomIcon = (colorHex, iconEmoji, glowColor = 'rgba(32, 184, 166, 0.4)') => {
      return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="background-color: ${colorHex}; box-shadow: 0 4px 14px ${glowColor};" class="w-8 h-8 rounded-full border-2 border-cloud-white flex items-center justify-center text-white transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125">
            <span style="font-size: 13px;">${iconEmoji}</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18]
      });
    };

    // 1. Hidden Gems (Tropical Teal)
    if (this.activeFilter === 'all' || this.activeFilter === 'gems') {
      data.hiddenGems.forEach(gem => {
        if (gem.coordinates) {
          const marker = L.marker(gem.coordinates, {
            icon: createCustomIcon('#20B8A6', '🌿', 'rgba(32, 184, 166, 0.5)')
          });

          marker.bindPopup(`
            <div class="w-64 p-0">
              <div class="h-28 w-full overflow-hidden relative">
                <img src="${gem.image}" class="w-full h-full object-cover" />
                <div class="absolute top-2 left-2 bg-ocean-navy/90 px-2 py-0.5 rounded text-[10px] text-tropical-teal font-bold">
                  Secret Spot
                </div>
                <div class="absolute top-2 right-2 bg-ocean-navy/90 px-2 py-0.5 rounded text-[10px] text-sand-warm font-bold">
                  ★ ${gem.uniquenessScore}
                </div>
              </div>
              <div class="p-3 bg-ocean-navy">
                <h5 class="font-bold text-sm text-cloud-white leading-tight mb-1">${gem.name}</h5>
                <p class="text-xs text-ocean-sky line-clamp-2 mb-2">${gem.whyAiRecommends}</p>
                <div class="flex items-center justify-between text-xs pt-2 border-t border-white/10">
                  <span class="text-tropical-teal font-semibold">Crowd: ${gem.crowdLevel}%</span>
                  <button onclick="window.WanderHiddenGems.addGemToActiveItinerary('${gem.id}')" class="px-2.5 py-1 rounded-lg btn-primary-teal text-[11px]">
                    Add to Trip
                  </button>
                </div>
              </div>
            </div>
          `, { className: 'custom-map-popup' });

          this.markersGroup.addLayer(marker);
        }
      });
    }

    // 2. Hotels (Ocean Blue)
    if (this.activeFilter === 'all' || this.activeFilter === 'hotels') {
      data.hotels.forEach(hotel => {
        if (hotel.coordinates) {
          const marker = L.marker(hotel.coordinates, {
            icon: createCustomIcon('#176B87', '🏨', 'rgba(23, 107, 135, 0.5)')
          });

          marker.bindPopup(`
            <div class="w-64 p-0">
              <div class="h-28 w-full overflow-hidden relative">
                <img src="${hotel.image}" class="w-full h-full object-cover" />
                <div class="absolute top-2 left-2 bg-ocean-navy/90 px-2 py-0.5 rounded text-[10px] text-tropical-teal font-bold">
                  ${hotel.tag || 'Boutique Stay'}
                </div>
              </div>
              <div class="p-3 bg-ocean-navy">
                <h5 class="font-bold text-sm text-cloud-white leading-tight mb-1">${hotel.name}</h5>
                <div class="text-xs text-ocean-sky mb-2">${hotel.distanceFromCenter}</div>
                <div class="flex items-center justify-between text-xs pt-2 border-t border-white/10">
                  <span class="font-extrabold text-cloud-white">${app.formatPrice(hotel.pricePerNightINR)}</span>
                  <button onclick="window.WanderBooking.openBookingModal('${hotel.id}', 'hotels')" class="px-2.5 py-1 rounded-lg btn-primary-teal text-[11px]">
                    Book Stay
                  </button>
                </div>
              </div>
            </div>
          `, { className: 'custom-map-popup' });

          this.markersGroup.addLayer(marker);
        }
      });
    }

    // 3. Restaurants (Sunset Coral)
    if (this.activeFilter === 'all' || this.activeFilter === 'dining') {
      data.restaurants.forEach(rest => {
        if (rest.coordinates) {
          const marker = L.marker(rest.coordinates, {
            icon: createCustomIcon('#FF8066', '🍽️', 'rgba(255, 128, 102, 0.5)')
          });

          marker.bindPopup(`
            <div class="w-64 p-0">
              <div class="h-28 w-full overflow-hidden relative">
                <img src="${rest.image}" class="w-full h-full object-cover" />
                <div class="absolute top-2 left-2 bg-ocean-navy/90 px-2 py-0.5 rounded text-[10px] text-sunset-coral font-bold">
                  ${rest.cuisine}
                </div>
              </div>
              <div class="p-3 bg-ocean-navy">
                <h5 class="font-bold text-sm text-cloud-white leading-tight mb-1">${rest.name}</h5>
                <p class="text-xs text-ocean-sky mb-2">${rest.specialty}</p>
                <div class="flex items-center justify-between text-xs pt-2 border-t border-white/10">
                  <span class="text-sand-warm font-semibold">${rest.priceCategory}</span>
                  <button onclick="window.WanderBooking.openBookingModal('${rest.id}', 'restaurants')" class="px-2.5 py-1 rounded-lg btn-primary-teal text-[11px]">
                    Reserve
                  </button>
                </div>
              </div>
            </div>
          `, { className: 'custom-map-popup' });

          this.markersGroup.addLayer(marker);
        }
      });
    }
  }

  plotItinerary(plan) {
    if (!this.map || typeof L === 'undefined' || !plan || !plan.days) return;

    const coords = [];
    plan.days.forEach(day => {
      ['morning', 'afternoon', 'evening', 'night'].forEach(slot => {
        if (day[slot] && day[slot].coordinates) {
          coords.push(day[slot].coordinates);
        }
      });
    });

    if (coords.length > 0) {
      if (this.routePolyline) {
        this.map.removeLayer(this.routePolyline);
      }

      this.routePolyline = L.polyline(coords, {
        color: '#20B8A6',
        weight: 4,
        opacity: 0.9,
        dashArray: '8, 8',
        lineCap: 'round'
      }).addTo(this.map);

      this.map.fitBounds(this.routePolyline.getBounds(), { padding: [40, 40] });
    }
  }

  invalidateSize() {
    if (this.map) {
      this.map.invalidateSize();
    }
  }

  flyToCoordinates(lat, lng, zoom = 13) {
    if (this.map) {
      this.map.flyTo([lat, lng], zoom, { duration: 1.5 });
    }
  }
}

// Global Map Instance
document.addEventListener('DOMContentLoaded', () => {
  window.WanderMap = new WanderMap();
});
