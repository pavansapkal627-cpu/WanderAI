/**
 * WanderAI - Core Application Controller (Sunset Explorer Theme)
 * Handles global reactive state, worldwide location synchronization,
 * currency conversion, theme switching, tab navigation, and modals.
 */

class WanderApp {
  constructor() {
    this.currency = localStorage.getItem('wander_currency') || 'INR';
    this.theme = localStorage.getItem('wander_theme') || 'dark';
    this.activeTab = 'home';
    this.activeDestination = 'Kyoto';
    this.activeItinerary = null;
    this.savedGems = JSON.parse(localStorage.getItem('wander_saved_gems') || '["gem-matheran-1", "gem-1", "gem-paris-1"]');
    this.savedTrips = JSON.parse(localStorage.getItem('wander_saved_trips') || '[]');
    this.userBookings = JSON.parse(localStorage.getItem('wander_bookings') || '[]');
    this.soundEnabled = localStorage.getItem('wander_sound') !== 'false';

    this.init();
  }

  init() {
    this.applyTheme(this.theme);
    this.setupEventListeners();
    this.loadInitialItinerary();
    this.renderHeroTrending();
    this.updateCurrencyLabels();
    this.updateBadgeCounts();

    // Sync active location in hero
    const activeLoc = window.WanderLocationService?.activeLocation;
    if (activeLoc) {
      this.updateDestinationDisplay(activeLoc);
    }

    // Check URL parameters for direct view routing
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['home', 'planner', 'booking', 'hidden-gems', 'map', 'dashboard'].includes(tabParam)) {
      this.switchTab(tabParam);
    }
  }

  setupEventListeners() {
    // Theme Switcher Buttons
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => this.toggleTheme());
    });

    // Currency Switcher Dropdown
    const currencySelect = document.getElementById('currencySelector');
    if (currencySelect) {
      currencySelect.value = this.currency;
      currencySelect.addEventListener('change', (e) => {
        this.setCurrency(e.target.value);
      });
    }

    // Navigation Tab Links
    document.querySelectorAll('[data-tab-target]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('data-tab-target');
        this.switchTab(target);
      });
    });

    // Global Search Form in Hero
    const heroSearchForm = document.getElementById('heroSearchForm');
    if (heroSearchForm) {
      heroSearchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleHeroSearch();
      });
    }

    // "Where to?" Worldwide Trigger Buttons
    document.querySelectorAll('.open-location-search-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.WanderLocationService) {
          window.WanderLocationService.openSearchModal();
        }
      });
    });

    // Location search modal close button
    const closeLocationModalBtn = document.getElementById('closeLocationSearchModalBtn');
    if (closeLocationModalBtn) {
      closeLocationModalBtn.addEventListener('click', () => {
        if (window.WanderLocationService) {
          window.WanderLocationService.closeSearchModal();
        }
      });
    }

    // Location search input listener with live geocoding
    const searchInput = document.getElementById('worldwideSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        if (window.WanderLocationService) {
          window.WanderLocationService.handleSearchInput(e.target.value);
        }
      });
    }
  }

  updateDestinationDisplay(loc) {
    const labelEl = document.getElementById('selectedDestinationLabel');
    if (labelEl && loc) {
      labelEl.innerHTML = `
        <span class="text-xs font-bold text-cloud-white block truncate">${loc.name}</span>
        <span class="text-[10px] text-ocean-sky font-medium block truncate">${loc.country} • ${loc.type}</span>
      `;
    }
  }

  loadInitialItinerary() {
    const saved = localStorage.getItem('wander_active_itinerary');
    if (saved) {
      try {
        this.activeItinerary = JSON.parse(saved);
      } catch (e) {
        this.activeItinerary = null;
      }
    }
    
    if (!this.activeItinerary && window.WanderLocationService) {
      const activeLoc = window.WanderLocationService.activeLocation;
      if (window.WanderPlanner) {
        this.activeItinerary = window.WanderPlanner.buildSmartItinerary(activeLoc, { days: 4, escapeCrowds: true });
        this.saveActiveItinerary();
      }
    }
  }

  saveActiveItinerary() {
    if (this.activeItinerary) {
      localStorage.setItem('wander_active_itinerary', JSON.stringify(this.activeItinerary));
    }
  }

  applyTheme(theme) {
    this.theme = theme;
    localStorage.setItem('wander_theme', theme);
    const root = document.documentElement;
    const body = document.body;

    if (theme === 'light') {
      root.classList.remove('dark');
      body.classList.add('light-mode');
    } else {
      root.classList.add('dark');
      body.classList.remove('light-mode');
    }

    document.querySelectorAll('.theme-icon').forEach(icon => {
      icon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
    });
    if (window.lucide) window.lucide.createIcons();

    if (window.WanderMap && typeof window.WanderMap.updateThemeTiles === 'function') {
      window.WanderMap.updateThemeTiles(theme);
    }
  }

  toggleTheme() {
    const newTheme = this.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
    this.showToast(`Switched to ${newTheme.toUpperCase()} mode`, 'info');
  }

  setCurrency(curr) {
    if (window.WANDER_DATA.currencies[curr]) {
      this.currency = curr;
      localStorage.setItem('wander_currency', curr);
      this.updateCurrencyLabels();
      this.showToast(`Currency updated to ${curr} (${window.WANDER_DATA.currencies[curr].symbol})`, 'success');

      if (window.WanderPlanner) window.WanderPlanner.renderItinerary();
      if (window.WanderBooking) window.WanderBooking.renderAll();
      if (window.WanderHiddenGems) window.WanderHiddenGems.renderGems();
      if (window.WanderDashboard) window.WanderDashboard.renderDashboard();
    }
  }

  formatPrice(amountINR) {
    const currData = window.WANDER_DATA.currencies[this.currency] || window.WANDER_DATA.currencies.INR;
    const converted = amountINR * currData.rate;

    if (this.currency === 'INR') {
      return `₹${Math.round(converted).toLocaleString('en-IN')}`;
    } else if (this.currency === 'USD') {
      return `$${Math.round(converted).toLocaleString('en-US')}`;
    } else if (this.currency === 'EUR') {
      return `€${Math.round(converted).toLocaleString('de-DE')}`;
    } else if (this.currency === 'GBP') {
      return `£${Math.round(converted).toLocaleString('en-GB')}`;
    } else if (this.currency === 'JPY') {
      return `¥${Math.round(converted).toLocaleString('ja-JP')}`;
    }
    return `${currData.symbol}${Math.round(converted).toLocaleString()}`;
  }

  updateCurrencyLabels() {
    const symbol = window.WANDER_DATA.currencies[this.currency].symbol;
    document.querySelectorAll('.currency-symbol').forEach(el => {
      el.textContent = symbol;
    });
  }

  switchTab(tabId) {
    this.activeTab = tabId;

    // Update Nav Tab Styles (Tropical Teal highlight)
    document.querySelectorAll('[data-tab-target]').forEach(el => {
      const isCurrent = el.getAttribute('data-tab-target') === tabId;
      el.classList.toggle('text-tropical-teal', isCurrent);
      el.classList.toggle('bg-tropical-teal/10', isCurrent);
      el.classList.toggle('border-tropical-teal/30', isCurrent);
      el.classList.toggle('font-bold', isCurrent);
    });

    document.querySelectorAll('.tab-content-pane').forEach(pane => {
      pane.classList.add('hidden');
    });

    const activePane = document.getElementById(`tab-pane-${tabId}`);
    if (activePane) {
      activePane.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (tabId === 'planner' && window.WanderPlanner) {
      window.WanderPlanner.renderItinerary();
    } else if (tabId === 'booking' && window.WanderBooking) {
      window.WanderBooking.renderAll();
    } else if (tabId === 'hidden-gems' && window.WanderHiddenGems) {
      window.WanderHiddenGems.renderGems();
    } else if (tabId === 'map' && window.WanderMap) {
      setTimeout(() => window.WanderMap.invalidateSize(), 200);
    } else if (tabId === 'dashboard' && window.WanderDashboard) {
      window.WanderDashboard.renderDashboard();
    }

    if (window.lucide) window.lucide.createIcons();
  }

  handleHeroSearch() {
    const activeLoc = window.WanderLocationService?.activeLocation || window.WANDER_DATA.destinations[0];
    const durationVal = parseInt(document.getElementById('heroDurationSelect')?.value || '4', 10);
    const travelersVal = document.getElementById('heroTravelersSelect')?.value || '2 Travelers (Couple)';
    const styleVal = document.getElementById('heroStyleSelect')?.value || 'Cultural & Hidden Spots';
    const escapeCrowds = document.getElementById('heroEscapeCrowdToggle')?.checked ?? true;

    this.switchTab('planner');
    if (window.WanderPlanner) {
      window.WanderPlanner.generateTripPlan({
        location: activeLoc,
        days: durationVal,
        travelers: travelersVal,
        style: styleVal,
        escapeCrowds: escapeCrowds
      });
    }
  }

  renderHeroTrending() {
    const container = document.getElementById('heroTrendingGrid');
    if (!container) return;

    const items = window.WANDER_DATA.destinations.slice(0, 4);
    container.innerHTML = items.map((dest, idx) => {
      const badgeStyle = idx === 0 ? 'bg-sunset-coral/90 text-ocean-deep font-black' :
                         idx === 1 ? 'bg-tropical-teal/90 text-ocean-deep font-bold' :
                         'bg-ocean-navy/90 text-sand-warm font-semibold';
      
      return `
        <div onclick="window.WanderApp.selectDestinationAndPlan('${dest.id}')" 
             class="group relative overflow-hidden rounded-3xl cursor-pointer glass-panel glass-panel-hover transition-all duration-300">
          <div class="h-52 w-full overflow-hidden relative">
            <img src="${dest.image}" alt="${dest.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-ocean-deep via-ocean-deep/40 to-transparent"></div>
            
            <div class="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider flex items-center gap-1.5 shadow-lg backdrop-blur-md ${badgeStyle}">
              <span class="w-1.5 h-1.5 rounded-full bg-current animate-ping"></span>
              ${dest.hiddenGemCount} Secret Spots
            </div>
            
            <div class="absolute bottom-3 left-4 right-4">
              <div class="text-[10px] uppercase tracking-wider text-tropical-teal font-extrabold mb-0.5">${dest.country}</div>
              <h4 class="text-base font-bold text-cloud-white leading-tight group-hover:text-tropical-teal transition-colors">${dest.name}</h4>
            </div>
          </div>

          <div class="p-4 flex items-center justify-between text-xs border-t border-white/5 bg-ocean-navy/60">
            <div class="flex items-center gap-1.5 text-cloud-text">
              <i data-lucide="shield-check" class="w-3.5 h-3.5 text-tropical-teal"></i>
              <span>Crowd: <strong class="text-tropical-teal">${dest.crowdIndex}%</strong></span>
            </div>
            <div class="text-ocean-sky font-medium">
              From <span class="text-cloud-white font-extrabold">${this.formatPrice(dest.defaultBudgetINR)}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  selectDestinationAndPlan(destId) {
    const dest = window.WANDER_DATA.destinations.find(d => d.id === destId);
    if (dest && window.WanderLocationService) {
      window.WanderLocationService.selectLocation({
        name: dest.name.split('&')[0].trim(),
        fullAddress: `${dest.name}, ${dest.country}`,
        country: dest.country,
        type: 'Curated Region',
        typeIcon: '✨',
        coordinates: dest.coordinates,
        image: dest.image,
        tagline: dest.tagline,
        crowdIndex: dest.crowdIndex,
        defaultBudgetINR: dest.defaultBudgetINR
      });
    }

    this.switchTab('planner');
    if (window.WanderPlanner) {
      window.WanderPlanner.generateTripPlan({
        location: dest || window.WanderLocationService?.activeLocation,
        days: 4
      });
    }
  }

  toggleSaveGem(gemId) {
    const idx = this.savedGems.indexOf(gemId);
    if (idx > -1) {
      this.savedGems.splice(idx, 1);
      this.showToast('Removed from saved wishlist', 'info');
    } else {
      this.savedGems.push(gemId);
      this.showToast('✨ Saved to your secret spots wishlist!', 'success');
      this.playChime();
    }
    localStorage.setItem('wander_saved_gems', JSON.stringify(this.savedGems));
    this.updateBadgeCounts();
    if (window.WanderHiddenGems) window.WanderHiddenGems.renderGems();
    if (window.WanderDashboard) window.WanderDashboard.renderDashboard();
  }

  updateBadgeCounts() {
    const gemBadges = document.querySelectorAll('.saved-gems-count-badge');
    gemBadges.forEach(b => {
      b.textContent = this.savedGems.length;
      b.classList.toggle('hidden', this.savedGems.length === 0);
    });

    const bookingBadges = document.querySelectorAll('.bookings-count-badge');
    bookingBadges.forEach(b => {
      b.textContent = this.userBookings.length;
      b.classList.toggle('hidden', this.userBookings.length === 0);
    });
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    const bgColors = {
      success: 'bg-ocean-navy/95 border-tropical-teal/50 text-cloud-white shadow-tropical-teal/15',
      info: 'bg-ocean-navy/95 border-tropical-teal/40 text-cloud-text shadow-tropical-teal/10',
      warning: 'bg-ocean-navy/95 border-sunset-coral/50 text-sunset-coral shadow-sunset-coral/15',
      error: 'bg-ocean-navy/95 border-rose-500/50 text-rose-200 shadow-rose-500/10'
    };

    const icons = {
      success: 'check-circle-2',
      info: 'sparkles',
      warning: 'alert-triangle',
      error: 'alert-circle'
    };

    toast.className = `flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300 transform translate-y-2 opacity-0 text-xs max-w-md ${bgColors[type] || bgColors.info}`;
    toast.innerHTML = `
      <i data-lucide="${icons[type] || 'info'}" class="w-4 h-4 flex-shrink-0 text-tropical-teal"></i>
      <div class="flex-1 font-semibold">${message}</div>
      <button onclick="this.parentElement.remove()" class="text-ocean-sky hover:text-cloud-white p-1 transition-colors">
        <i data-lucide="x" class="w-3.5 h-3.5"></i>
      </button>
    `;

    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    }, 10);

    setTimeout(() => {
      toast.classList.add('opacity-0', '-translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  playChime() {
    if (!this.soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880.0, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      // Audio fallback
    }
  }
}

// Instantiate globally
document.addEventListener('DOMContentLoaded', () => {
  window.WanderApp = new WanderApp();
});
