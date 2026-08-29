/**
 * WanderAI - Worldwide Location Search & Selection Service
 * Provides global geocoding, live autocomplete via OpenStreetMap Nominatim,
 * rich offline fallback dictionary, reverse geocoding, recent searches cache,
 * and mini interactive world map picker integration.
 */

class LocationService {
  constructor() {
    this.debounceTimer = null;
    this.recentSearchesKey = 'wander_recent_locations';
    this.activeLocation = this.getStoredLocation() || {
      name: 'Kyoto',
      fullAddress: 'Kyoto, Kansai Region, Japan',
      country: 'Japan',
      type: 'City',
      typeIcon: '🏙️',
      coordinates: [35.0116, 135.7681],
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=85',
      tagline: 'Ancient Zen gardens, misty cedar forests & secret teahouses',
      crowdIndex: 78,
      defaultBudgetINR: 125000
    };

    // Pre-curated dictionary of popular, offbeat, hill stations, and iconic landmarks worldwide
    this.curatedWorldwideLocations = [
      {
        name: 'Pune',
        fullAddress: 'Pune, Maharashtra, India',
        country: 'India',
        type: 'City',
        typeIcon: '🏙️',
        coordinates: [18.5204, 73.8567],
        image: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=800&q=80',
        tagline: 'Cultural capital of Maharashtra with historic hill forts and vibrant tech food culture',
        crowdIndex: 52,
        defaultBudgetINR: 28000
      },
      {
        name: 'Matheran',
        fullAddress: 'Matheran Hill Station, Raigad, Maharashtra, India',
        country: 'India',
        type: 'Hill Station',
        typeIcon: '🏔️',
        coordinates: [18.9868, 73.2676],
        image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
        tagline: 'Asia’s only automobile-free hill station surrounded by red soil paths and misty lookouts',
        crowdIndex: 22,
        defaultBudgetINR: 18000
      },
      {
        name: 'Tokyo',
        fullAddress: 'Tokyo, Kanto Region, Japan',
        country: 'Japan',
        type: 'Metropolis',
        typeIcon: '🏙️',
        coordinates: [35.6762, 139.6503],
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
        tagline: 'Futuristic neon skyline intertwined with quiet backstreet shrines and ramen alleys',
        crowdIndex: 84,
        defaultBudgetINR: 135000
      },
      {
        name: 'Kyoto',
        fullAddress: 'Kyoto, Kansai Region, Japan',
        country: 'Japan',
        type: 'City',
        typeIcon: '⛩️',
        coordinates: [35.0116, 135.7681],
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
        tagline: 'Ancient Zen gardens, misty bamboo forests, and secluded moss sanctuaries',
        crowdIndex: 78,
        defaultBudgetINR: 125000
      },
      {
        name: 'Paris',
        fullAddress: 'Paris, Île-de-France, France',
        country: 'France',
        type: 'City',
        typeIcon: '🗼',
        coordinates: [48.8566, 2.3522],
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
        tagline: 'Haussmannian boulevards, hidden courtyard art galleries, and riverside bookstalls',
        crowdIndex: 88,
        defaultBudgetINR: 165000
      },
      {
        name: 'Eiffel Tower',
        fullAddress: 'Champ de Mars, 5 Av. Anatole France, 75007 Paris, France',
        country: 'France',
        type: 'Landmark',
        typeIcon: '🏛️',
        coordinates: [48.8584, 2.2945],
        image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80',
        tagline: 'Iconic iron lattice monument overlooking the Seine river and Parisian rooftops',
        crowdIndex: 95,
        defaultBudgetINR: 170000
      },
      {
        name: 'New York City',
        fullAddress: 'New York, NY, United States',
        country: 'USA',
        type: 'City',
        typeIcon: '🏙️',
        coordinates: [40.7128, -74.0060],
        image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
        tagline: 'The iconic city that never sleeps, with hidden speakeasies and world-class culture',
        crowdIndex: 90,
        defaultBudgetINR: 195000
      },
      {
        name: 'Bali (Sidemen & North Coast)',
        fullAddress: 'Sidemen, Karangasem, Bali, Indonesia',
        country: 'Indonesia',
        type: 'Island & Valley',
        typeIcon: '🌴',
        coordinates: [-8.4095, 115.1889],
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
        tagline: 'Misty emerald rice terraces, volcanic hot springs, and sacred jungle waterfalls',
        crowdIndex: 65,
        defaultBudgetINR: 85000
      },
      {
        name: 'Santorini',
        fullAddress: 'Santorini, Cyclades, Greece',
        country: 'Greece',
        type: 'Island',
        typeIcon: '🏖️',
        coordinates: [36.3932, 25.4615],
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
        tagline: 'Whitewashed cliffside cubist villages overlooking the cobalt blue Aegean caldera',
        crowdIndex: 86,
        defaultBudgetINR: 180000
      },
      {
        name: 'Swiss Alps & Lauterbrunnen',
        fullAddress: 'Lauterbrunnen, Bernese Oberland, Switzerland',
        country: 'Switzerland',
        type: 'Mountain & Valley',
        typeIcon: '🏔️',
        coordinates: [46.5935, 7.9079],
        image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
        tagline: '72 vertical waterfalls, car-free alpine hamlets, and towering glacier peaks',
        crowdIndex: 60,
        defaultBudgetINR: 210000
      },
      {
        name: 'Udaipur',
        fullAddress: 'Udaipur, Rajasthan, India',
        country: 'India',
        type: 'Heritage City',
        typeIcon: '🏰',
        coordinates: [24.5854, 73.7125],
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
        tagline: 'City of Lakes with floating royal palaces, sunset havelis, and Aravalli fortresses',
        crowdIndex: 55,
        defaultBudgetINR: 45000
      },
      {
        name: 'Amalfi Coast & Ischia',
        fullAddress: 'Amalfi Coast, Campania, Italy',
        country: 'Italy',
        type: 'Coastline',
        typeIcon: '🌊',
        coordinates: [40.6340, 14.6027],
        image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
        tagline: 'Vertical pastel villages clinging to Mediterranean cliffs surrounded by lemon groves',
        crowdIndex: 82,
        defaultBudgetINR: 175000
      },
      {
        name: 'Cappadocia',
        fullAddress: 'Goreme, Cappadocia, Nevsehir, Turkey',
        country: 'Turkey',
        type: 'Historic Valley',
        typeIcon: '🎈',
        coordinates: [38.6431, 34.8289],
        image: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?auto=format&fit=crop&w=800&q=80',
        tagline: 'Fairy chimneys, sunrise hot air balloons, and underground troglodyte cities',
        crowdIndex: 58,
        defaultBudgetINR: 95000
      },
      {
        name: 'South Goa Secret Coves',
        fullAddress: 'Canacona, South Goa, India',
        country: 'India',
        type: 'Coastal Beaches',
        typeIcon: '🏖️',
        coordinates: [15.0210, 73.9856],
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
        tagline: 'Quiet turtle nesting beaches, secluded river kayaking, and Portuguese villas',
        crowdIndex: 48,
        defaultBudgetINR: 35000
      },
      {
        name: 'Iceland Highlands & South Coast',
        fullAddress: 'South Coast & Highlands, Iceland',
        country: 'Iceland',
        type: 'Volcanic Island',
        typeIcon: '🌋',
        coordinates: [64.9631, -19.0208],
        image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=800&q=80',
        tagline: 'Obsidian black sand beaches, geothermal warm rivers, and aurora borealis vistas',
        crowdIndex: 42,
        defaultBudgetINR: 195000
      },
      {
        name: 'Banff & Lake Louise',
        fullAddress: 'Banff National Park, Alberta, Canada',
        country: 'Canada',
        type: 'National Park',
        typeIcon: '🌲',
        coordinates: [51.1784, -115.5708],
        image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=800&q=80',
        tagline: 'Glacial turquoise alpine lakes framed by Canadian Rocky mountain peaks',
        crowdIndex: 68,
        defaultBudgetINR: 185000
      }
    ];

    this.miniMap = null;
    this.miniMapMarker = null;
  }

  getStoredLocation() {
    try {
      const stored = localStorage.getItem('wander_active_location');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  }

  setStoredLocation(loc) {
    this.activeLocation = loc;
    localStorage.setItem('wander_active_location', JSON.stringify(loc));
    this.addToRecentSearches(loc);
  }

  getRecentSearches() {
    try {
      const rec = localStorage.getItem(this.recentSearchesKey);
      return rec ? JSON.parse(rec) : [];
    } catch (e) {
      return [];
    }
  }

  addToRecentSearches(loc) {
    let recents = this.getRecentSearches();
    recents = recents.filter(r => r.name.toLowerCase() !== loc.name.toLowerCase());
    recents.unshift({
      name: loc.name,
      fullAddress: loc.fullAddress,
      country: loc.country,
      type: loc.type,
      typeIcon: loc.typeIcon || '📍',
      coordinates: loc.coordinates,
      image: loc.image
    });
    if (recents.length > 8) recents.pop();
    localStorage.setItem(this.recentSearchesKey, JSON.stringify(recents));
  }

  /**
   * Search worldwide locations using live Nominatim Geocoding API + curated fallback
   * @param {string} query
   * @returns {Promise<Array>}
   */
  async searchWorldwide(query) {
    const q = query.trim().toLowerCase();
    if (!q) return this.curatedWorldwideLocations.slice(0, 8);

    // 1. Search local curated dictionary first for instant high-quality match
    const localMatches = this.curatedWorldwideLocations.filter(loc => 
      loc.name.toLowerCase().includes(q) ||
      loc.fullAddress.toLowerCase().includes(q) ||
      loc.country.toLowerCase().includes(q) ||
      loc.type.toLowerCase().includes(q)
    );

    // 2. Fetch live worldwide geocoding from OpenStreetMap Nominatim
    try {
      const encodedQuery = encodeURIComponent(query.trim());
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&addressdetails=1&limit=8`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout

      const response = await fetch(url, {
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const rawResults = await response.json();
        const apiMatches = rawResults.map(item => this.normalizeNominatimResult(item));
        
        // Merge and deduplicate by name + country
        const combined = [...localMatches];
        apiMatches.forEach(apiItem => {
          const exists = combined.some(c => 
            c.name.toLowerCase() === apiItem.name.toLowerCase() &&
            c.country.toLowerCase() === apiItem.country.toLowerCase()
          );
          if (!exists) {
            combined.push(apiItem);
          }
        });

        return combined.slice(0, 10);
      }
    } catch (e) {
      // Graceful fallback to local fuzzy matching
      console.warn('Live geocoding fallback active:', e);
    }

    return localMatches.length > 0 ? localMatches : this.generateFuzzyLocationFallback(query);
  }

  normalizeNominatimResult(item) {
    const address = item.address || {};
    const name = address.city || address.town || address.village || address.municipality || address.county || item.name || item.display_name.split(',')[0];
    const country = address.country || 'Global';
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);

    // Determine type & icon
    let type = 'Location';
    let typeIcon = '📍';
    if (item.type === 'city' || address.city) { type = 'City'; typeIcon = '🏙️'; }
    else if (item.type === 'town' || item.type === 'village') { type = 'Town / Village'; typeIcon = '🏡'; }
    else if (item.type === 'hill' || item.type === 'mountain' || item.type === 'peak') { type = 'Mountain / Hill'; typeIcon = '🏔️'; }
    else if (item.type === 'attraction' || item.type === 'monument' || item.type === 'museum' || item.type === 'historic') { type = 'Landmark'; typeIcon = '🏛️'; }
    else if (item.type === 'beach' || item.type === 'coastal') { type = 'Beach'; typeIcon = '🏖️'; }
    else if (item.type === 'national_park' || item.type === 'park') { type = 'National Park'; typeIcon = '🌲'; }
    else if (item.type === 'aerodrome' || item.type === 'airport') { type = 'Airport'; typeIcon = '✈️'; }

    // Dynamic aesthetic travel image based on category
    const defaultImages = {
      'City': 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=800&q=80',
      'Hill Station': 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
      'Mountain / Hill': 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
      'Landmark': 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80',
      'Beach': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      'National Park': 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=800&q=80',
      'Location': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'
    };

    return {
      name: name,
      fullAddress: item.display_name,
      country: country,
      type: type,
      typeIcon: typeIcon,
      coordinates: [lat, lon],
      image: defaultImages[type] || defaultImages['Location'],
      tagline: `Discover the hidden spots, local cuisine, and culture of ${name}, ${country}`,
      crowdIndex: Math.floor(35 + Math.random() * 45),
      defaultBudgetINR: 65000
    };
  }

  generateFuzzyLocationFallback(query) {
    const clean = query.trim();
    const capitalized = clean.charAt(0).toUpperCase() + clean.slice(1);
    return [
      {
        name: capitalized,
        fullAddress: `${capitalized} (Global Destination)`,
        country: 'Worldwide Destination',
        type: 'Discovered Place',
        typeIcon: '✨',
        coordinates: [20.0 + (Math.random() * 20), 75.0 + (Math.random() * 20)],
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
        tagline: `Custom AI-synthesized travel plan and secluded spots for ${capitalized}`,
        crowdIndex: 40,
        defaultBudgetINR: 50000
      }
    ];
  }

  /**
   * Reverse geocode coordinates to location object
   */
  async reverseGeocode(lat, lon) {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;
      const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (response.ok) {
        const item = await response.json();
        return this.normalizeNominatimResult(item);
      }
    } catch (e) {
      console.warn('Reverse geocode fallback:', e);
    }

    return {
      name: `Location (${lat.toFixed(2)}, ${lon.toFixed(2)})`,
      fullAddress: `Coordinates: ${lat.toFixed(4)}, ${lon.toFixed(4)}`,
      country: 'Global Map Selection',
      type: 'Custom Point',
      typeIcon: '📍',
      coordinates: [lat, lon],
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
      tagline: 'Custom map-pinned exploration point',
      crowdIndex: 30,
      defaultBudgetINR: 55000
    };
  }

  /**
   * Initialize or update the interactive mini map inside the search modal
   */
  initModalMiniMap(containerId = 'locationPickerMiniMap') {
    const el = document.getElementById(containerId);
    if (!el || typeof L === 'undefined') return;

    if (!this.miniMap) {
      this.miniMap = L.map(containerId, {
        zoomControl: true,
        attributionControl: false
      }).setView(this.activeLocation.coordinates, 6);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
        subdomains: 'abcd'
      }).addTo(this.miniMap);

      // Custom pulsing glowing pin (Tropical Teal)
      const glowingIcon = L.divIcon({
        className: 'modal-map-pin',
        html: `
          <div class="relative flex items-center justify-center">
            <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-tropical-teal opacity-75"></span>
            <div class="w-6 h-6 rounded-full bg-tropical-teal border-2 border-cloud-white shadow-xl flex items-center justify-center text-ocean-deep font-bold text-xs">
              📍
            </div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      this.miniMapMarker = L.marker(this.activeLocation.coordinates, { icon: glowingIcon }).addTo(this.miniMap);

      // Click on map to select arbitrary worldwide coordinate
      this.miniMap.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        this.miniMapMarker.setLatLng([lat, lng]);
        
        // Show temporary marker popup
        this.miniMapMarker.bindPopup('<span class="text-xs font-semibold text-tropical-teal">Resolving location details...</span>').openPopup();
        
        const resolved = await this.reverseGeocode(lat, lng);
        this.miniMapMarker.bindPopup(`
          <div class="text-xs p-1">
            <strong class="text-cloud-white block">${resolved.name}</strong>
            <span class="text-ocean-sky text-[10px] block mb-1.5">${resolved.country}</span>
            <button onclick="window.WanderLocationService.confirmLocationFromMap()" class="px-2.5 py-1 rounded-xl btn-primary-teal text-[10px]">
              Select Destination
            </button>
          </div>
        `).openPopup();

        this.tempMapSelection = resolved;
      });
    } else {
      setTimeout(() => {
        this.miniMap.invalidateSize();
        this.miniMap.setView(this.activeLocation.coordinates, 6);
        if (this.miniMapMarker) {
          this.miniMapMarker.setLatLng(this.activeLocation.coordinates);
        }
      }, 150);
    }
  }

  confirmLocationFromMap() {
    if (this.tempMapSelection) {
      this.selectLocation(this.tempMapSelection);
    }
  }

  selectLocation(loc) {
    this.setStoredLocation(loc);

    // Update hero search button display
    const labelEl = document.getElementById('selectedDestinationLabel');
    if (labelEl) {
      labelEl.innerHTML = `
        <span class="text-xs font-bold text-cloud-white block truncate">${loc.name}</span>
        <span class="text-[10px] text-ocean-sky font-medium block truncate">${loc.country} • ${loc.type}</span>
      `;
    }

    // Update active itinerary destination
    if (window.WanderApp) {
      window.WanderApp.activeDestination = loc.name;
    }

    // Close modal
    this.closeSearchModal();

    // Show toast
    if (window.WanderApp) {
      window.WanderApp.showToast(`📍 Selected: ${loc.name}, ${loc.country}`, 'success');
      window.WanderApp.playChime();
    }
  }

  openSearchModal() {
    const modal = document.getElementById('locationSearchModal');
    if (!modal) return;

    modal.classList.remove('hidden');
    document.getElementById('worldwideSearchInput')?.focus();

    this.renderSearchResults();
    this.initModalMiniMap();
  }

  closeSearchModal() {
    const modal = document.getElementById('locationSearchModal');
    if (modal) modal.classList.add('hidden');
  }

  async handleSearchInput(value) {
    clearTimeout(this.debounceTimer);
    const spinner = document.getElementById('locationSearchSpinner');
    if (spinner) spinner.classList.remove('hidden');

    this.debounceTimer = setTimeout(async () => {
      const results = await this.searchWorldwide(value);
      if (spinner) spinner.classList.add('hidden');
      this.renderSearchResults(results, value);
    }, 280);
  }

  renderSearchResults(results = null, query = '') {
    const container = document.getElementById('locationSearchResultsList');
    if (!container) return;

    const list = results || this.curatedWorldwideLocations.slice(0, 6);
    const recents = this.getRecentSearches();

    let html = '';

    // If query is empty, show Recent Searches & Popular Chips
    if (!query && recents.length > 0) {
      html += `
        <div class="mb-4">
          <div class="text-[11px] font-bold text-ocean-sky uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <i data-lucide="history" class="w-3.5 h-3.5 text-tropical-teal"></i>
            <span>Recent Searches</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            ${recents.slice(0, 4).map(r => `
              <button onclick="window.WanderLocationService.selectLocation(${JSON.stringify(r).replace(/"/g, '&quot;')})" 
                      class="flex items-center gap-3 p-2.5 rounded-2xl bg-ocean-dark/80 hover:bg-ocean-mid border border-white/5 text-left transition-colors group">
                <span class="text-lg">${r.typeIcon || '📍'}</span>
                <div class="min-w-0 flex-1">
                  <div class="text-xs font-bold text-cloud-white group-hover:text-tropical-teal transition-colors truncate">${r.name}</div>
                  <div class="text-[10px] text-ocean-sky truncate">${r.country}</div>
                </div>
              </button>
            `).join('')}
          </div>
        </div>
      `;
    }

    html += `
      <div>
        <div class="text-[11px] font-bold text-ocean-sky uppercase tracking-wider mb-2 flex items-center justify-between">
          <span class="flex items-center gap-1.5">
            <i data-lucide="globe-2" class="w-3.5 h-3.5 text-tropical-teal"></i>
            ${query ? `Worldwide Results for "${query}"` : 'Popular & Offbeat Destinations'}
          </span>
          <span class="text-[10px] text-tropical-teal font-medium">Click to select</span>
        </div>

        <div class="space-y-2 max-h-72 overflow-y-auto pr-1">
          ${list.map(loc => `
            <div onclick="window.WanderLocationService.selectLocation(${JSON.stringify(loc).replace(/"/g, '&quot;')})" 
                 class="flex items-center justify-between p-3 rounded-2xl bg-ocean-dark/70 hover:bg-ocean-mid border border-white/5 hover:border-tropical-teal/35 cursor-pointer transition-all group">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 rounded-xl overflow-hidden bg-ocean-navy flex-shrink-0 relative">
                  <img src="${loc.image}" alt="${loc.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <h5 class="text-xs font-bold text-cloud-white group-hover:text-tropical-teal transition-colors truncate">${loc.name}</h5>
                    <span class="text-[9px] px-2 py-0.5 rounded-full bg-tropical-teal/15 border border-tropical-teal/30 text-tropical-teal font-semibold flex-shrink-0">
                      ${loc.typeIcon || '📍'} ${loc.type}
                    </span>
                  </div>
                  <p class="text-[10px] text-ocean-sky truncate mt-0.5">${loc.fullAddress}</p>
                </div>
              </div>

              <div class="flex items-center gap-2 flex-shrink-0 ml-2">
                <span class="text-[10px] text-sunset-coral font-bold hidden sm:inline">
                  ${100 - (loc.crowdIndex || 50)}% Crowd-Free
                </span>
                <i data-lucide="chevron-right" class="w-4 h-4 text-ocean-sky group-hover:text-tropical-teal group-hover:translate-x-0.5 transition-all"></i>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
  }
}

// Global Instance
window.WanderLocationService = new LocationService();
