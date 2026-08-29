/**
 * WanderAI - Travel Booking Engine (Sunset Explorer Theme)
 * Multi-category booking manager: Hotels, Flights, Trains, Buses,
 * Car Rentals, Experiences, Dining, with checkout modal & e-ticket generation.
 */

class WanderBooking {
  constructor() {
    this.activeCategory = 'hotels';
    this.currentSearchQuery = '';
    this.activeFilters = {
      maxPrice: 200000,
      minRating: 0,
      freeCancellationOnly: false,
      sortBy: 'recommended'
    };
    this.activeModalItem = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Category Sub-Navigation Buttons
    document.querySelectorAll('.booking-category-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-booking-category');
        this.switchCategory(cat);
      });
    });

    // Booking Search Input
    const searchInput = document.getElementById('bookingSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.currentSearchQuery = e.target.value.toLowerCase();
        this.renderCategoryResults();
      });
    }

    // Sort Dropdown
    const sortSelect = document.getElementById('bookingSortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.activeFilters.sortBy = e.target.value;
        this.renderCategoryResults();
      });
    }

    // Free Cancellation Filter
    const freeCancelCheckbox = document.getElementById('bookingFreeCancelFilter');
    if (freeCancelCheckbox) {
      freeCancelCheckbox.addEventListener('change', (e) => {
        this.activeFilters.freeCancellationOnly = e.target.checked;
        this.renderCategoryResults();
      });
    }
  }

  switchCategory(category) {
    this.activeCategory = category;

    // Update active button state (Tropical Teal)
    document.querySelectorAll('.booking-category-btn').forEach(btn => {
      const isCurrent = btn.getAttribute('data-booking-category') === category;
      btn.classList.toggle('bg-tropical-teal', isCurrent);
      btn.classList.toggle('text-ocean-deep', isCurrent);
      btn.classList.toggle('font-black', isCurrent);
      btn.classList.toggle('shadow-lg', isCurrent);
      btn.classList.toggle('bg-ocean-dark/80', !isCurrent);
      btn.classList.toggle('text-ocean-sky', !isCurrent);
    });

    this.renderCategoryResults();
  }

  renderAll() {
    this.renderCategoryResults();
  }

  renderCategoryResults() {
    const container = document.getElementById('bookingResultsContainer');
    const headerTitle = document.getElementById('bookingCategoryHeading');
    if (!container) return;

    const data = window.WANDER_DATA;
    let items = [];

    if (this.activeCategory === 'hotels') {
      items = data.hotels;
      if (headerTitle) headerTitle.textContent = 'Curated Boutique Stays & Secluded Heritage Villas';
    } else if (this.activeCategory === 'flights') {
      items = data.flights;
      if (headerTitle) headerTitle.textContent = 'Smart Eco-Optimized Flights & Direct Routes';
    } else if (this.activeCategory === 'trains') {
      items = data.trains;
      if (headerTitle) headerTitle.textContent = 'Scenic Alpine & High-Speed Panoramic Trains';
    } else if (this.activeCategory === 'buses') {
      items = data.buses;
      if (headerTitle) headerTitle.textContent = 'Luxury Sleeper Pods & Hop-on Coastal Shuttles';
    } else if (this.activeCategory === 'cars') {
      items = data.cars;
      if (headerTitle) headerTitle.textContent = 'Electric AWDs, 4x4 Defenders & Vintage Convertibles';
    } else if (this.activeCategory === 'activities') {
      items = data.activities;
      if (headerTitle) headerTitle.textContent = 'Authentic Local Masterclasses & Secret Expeditions';
    } else if (this.activeCategory === 'restaurants') {
      items = data.restaurants;
      if (headerTitle) headerTitle.textContent = 'Hidden Courtyard Bistros & Cliff-Edge Sunset Dining';
    }

    // Filter by search query
    if (this.currentSearchQuery) {
      items = items.filter(item => {
        const text = (item.name || item.title || item.model || item.airline || item.route || '') +
                     ' ' + (item.location || item.origin || item.destination || item.cuisine || '');
        return text.toLowerCase().includes(this.currentSearchQuery);
      });
    }

    // Filter by cancellation
    if (this.activeFilters.freeCancellationOnly) {
      items = items.filter(item => {
        const canText = (item.cancellation || '');
        return canText.toLowerCase().includes('free') || canText.toLowerCase().includes('100%');
      });
    }

    // Sort items
    if (this.activeFilters.sortBy === 'price-low') {
      items.sort((a, b) => (a.priceINR || a.pricePerNightINR || a.pricePerDayINR || 0) - (b.priceINR || b.pricePerNightINR || b.pricePerDayINR || 0));
    } else if (this.activeFilters.sortBy === 'price-high') {
      items.sort((a, b) => (b.priceINR || b.pricePerNightINR || b.pricePerDayINR || 0) - (a.priceINR || a.pricePerNightINR || a.pricePerDayINR || 0));
    } else if (this.activeFilters.sortBy === 'rating') {
      items.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
    }

    if (items.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-16 glass-panel rounded-3xl p-8 border border-white/5">
          <i data-lucide="search-x" class="w-12 h-12 text-ocean-sky mx-auto mb-3"></i>
          <h4 class="text-lg font-bold text-cloud-white mb-1">No matching bookings found</h4>
          <p class="text-xs text-ocean-sky">Try adjusting your keyword, removing filters, or choosing another category.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    container.innerHTML = items.map(item => this.buildItemCard(item, this.activeCategory)).join('');
    if (window.lucide) window.lucide.createIcons();
  }

  buildItemCard(item, category) {
    const app = window.WanderApp;

    if (category === 'hotels') {
      return `
        <div class="glass-panel glass-panel-hover rounded-3xl overflow-hidden border border-white/5 flex flex-col justify-between shadow-xl">
          <div class="relative h-52 overflow-hidden group">
            <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div class="absolute top-3 left-3 bg-ocean-navy/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-tropical-teal/30 text-xs font-semibold text-tropical-teal">
              ${item.tag || item.type}
            </div>
            <div class="absolute top-3 right-3 bg-ocean-navy/90 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 text-xs font-bold text-sand-warm flex items-center gap-1">
              <i data-lucide="star" class="w-3.5 h-3.5 fill-sand-warm"></i>
              ${item.rating} <span class="text-ocean-sky text-[10px]">(${item.reviewsCount})</span>
            </div>
            <div class="absolute bottom-3 left-3 right-3 bg-ocean-navy/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs text-tropical-teal flex items-center gap-1.5 border border-tropical-teal/20">
              <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
              ${item.crowdScore}
            </div>
          </div>

          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div class="text-xs text-ocean-sky mb-1 flex items-center gap-1">
                <i data-lucide="map-pin" class="w-3 h-3 text-tropical-teal"></i>
                ${item.location}
              </div>
              <h4 class="text-base font-bold text-cloud-white mb-2 line-clamp-1">${item.name}</h4>
              
              <div class="flex flex-wrap gap-1.5 mb-3">
                ${item.amenities.slice(0, 3).map(a => `
                  <span class="text-[10px] px-2 py-0.5 rounded-md bg-ocean-dark border border-white/5 text-cloud-text">${a}</span>
                `).join('')}
              </div>

              <div class="text-[11px] text-tropical-teal font-medium mb-3 flex items-center gap-1">
                <i data-lucide="check" class="w-3 h-3"></i>
                ${item.cancellation}
              </div>
            </div>

            <div class="pt-3 border-t border-white/5 flex items-center justify-between">
              <div>
                <span class="text-xs text-ocean-sky">Per night</span>
                <div class="text-lg font-extrabold text-cloud-white">${app.formatPrice(item.pricePerNightINR)}</div>
              </div>
              <button onclick="window.WanderBooking.openBookingModal('${item.id}', 'hotels')" class="btn-primary-teal px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg">
                <span>Book Stay</span>
                <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    } else if (category === 'flights') {
      return `
        <div class="glass-panel glass-panel-hover rounded-3xl p-5 border border-white/5 flex flex-col justify-between shadow-xl">
          <div>
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <span class="text-xl">${item.logo}</span>
                <div>
                  <h4 class="text-sm font-bold text-cloud-white leading-tight">${item.airline}</h4>
                  <span class="text-[11px] text-ocean-sky font-mono">${item.flightNumber} • ${item.cabinClass}</span>
                </div>
              </div>
              <span class="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-tropical-teal/15 border border-tropical-teal/30 text-tropical-teal">
                🌱 ${item.carbonOffsetKg} kg CO2
              </span>
            </div>

            <div class="grid grid-cols-3 items-center text-center my-4 py-3 bg-ocean-dark/60 rounded-2xl border border-white/5">
              <div>
                <div class="text-base font-bold text-cloud-white">${item.departureTime}</div>
                <div class="text-[10px] text-tropical-teal font-semibold">${item.origin.split(' ')[0]}</div>
              </div>
              <div class="flex flex-col items-center">
                <span class="text-[10px] text-ocean-sky mb-0.5">${item.duration}</span>
                <div class="w-full flex items-center justify-center relative">
                  <div class="w-full h-0.5 bg-ocean-mid"></div>
                  <i data-lucide="plane" class="w-3.5 h-3.5 text-tropical-teal absolute"></i>
                </div>
                <span class="text-[9px] text-sunset-coral font-bold mt-1">${item.stops}</span>
              </div>
              <div>
                <div class="text-base font-bold text-cloud-white">${item.arrivalTime}</div>
                <div class="text-[10px] text-tropical-teal font-semibold">${item.destination.split(' ')[0]}</div>
              </div>
            </div>

            <div class="text-[11px] text-cloud-text mb-3 flex items-center gap-1.5">
              <i data-lucide="luggage" class="w-3.5 h-3.5 text-tropical-teal"></i>
              <span>${item.baggage}</span>
            </div>
          </div>

          <div class="pt-3 border-t border-white/5 flex items-center justify-between">
            <div>
              <span class="text-xs text-ocean-sky">Total fare</span>
              <div class="text-lg font-extrabold text-cloud-white">${app.formatPrice(item.priceINR)}</div>
            </div>
            <button onclick="window.WanderBooking.openBookingModal('${item.id}', 'flights')" class="btn-primary-teal px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg">
              <span>Select Flight</span>
              <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      `;
    } else if (category === 'trains') {
      return `
        <div class="glass-panel glass-panel-hover rounded-3xl p-5 border border-white/5 flex flex-col justify-between shadow-xl">
          <div>
            <div class="flex items-center justify-between mb-3">
              <div>
                <span class="text-xs font-semibold text-tropical-teal uppercase tracking-wider">${item.classType}</span>
                <h4 class="text-base font-bold text-cloud-white leading-tight">${item.name}</h4>
              </div>
              <span class="text-xs font-bold px-2 py-1 rounded-lg bg-ocean-dark border border-white/10 text-sand-warm">
                ⚡ ${item.speed}
              </span>
            </div>

            <div class="p-3 bg-ocean-dark/70 rounded-2xl border border-white/5 my-3">
              <div class="text-xs font-semibold text-cloud-white mb-1">${item.route}</div>
              <div class="text-[11px] text-ocean-sky flex items-center justify-between">
                <span>Dep: ${item.departureTime}</span>
                <span>Dur: ${item.duration}</span>
                <span>Arr: ${item.arrivalTime}</span>
              </div>
            </div>

            <div class="flex flex-wrap gap-1 mb-3">
              ${item.amenities.map(a => `
                <span class="text-[10px] px-2 py-0.5 rounded-md bg-ocean-dark border border-white/5 text-cloud-text">${a}</span>
              `).join('')}
            </div>
          </div>

          <div class="pt-3 border-t border-white/5 flex items-center justify-between">
            <div>
              <span class="text-xs text-ocean-sky">Reserved seat</span>
              <div class="text-lg font-extrabold text-cloud-white">${app.formatPrice(item.priceINR)}</div>
            </div>
            <button onclick="window.WanderBooking.openBookingModal('${item.id}', 'trains')" class="btn-primary-teal px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg">
              <span>Book Train</span>
              <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      `;
    } else if (category === 'cars') {
      return `
        <div class="glass-panel glass-panel-hover rounded-3xl overflow-hidden border border-white/5 flex flex-col justify-between shadow-xl">
          <div class="relative h-48 overflow-hidden group">
            <img src="${item.image}" alt="${item.model}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div class="absolute top-3 left-3 bg-ocean-navy/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-tropical-teal/30 text-xs font-semibold text-tropical-teal">
              ${item.category}
            </div>
          </div>

          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <h4 class="text-base font-bold text-cloud-white mb-2">${item.model}</h4>
              <div class="grid grid-cols-2 gap-2 text-xs text-cloud-text mb-3 bg-ocean-dark/60 p-2.5 rounded-2xl border border-white/5">
                <div>💺 ${item.seats} Seats</div>
                <div>⚙️ ${item.transmission}</div>
                <div>⛽ ${item.fuelType.slice(0, 18)}</div>
                <div>🧳 ${item.luggage}</div>
              </div>
            </div>

            <div class="pt-3 border-t border-white/5 flex items-center justify-between">
              <div>
                <span class="text-xs text-ocean-sky">Daily rate</span>
                <div class="text-lg font-extrabold text-cloud-white">${app.formatPrice(item.pricePerDayINR)}</div>
              </div>
              <button onclick="window.WanderBooking.openBookingModal('${item.id}', 'cars')" class="btn-primary-teal px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg">
                <span>Rent Car</span>
                <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    } else if (category === 'activities') {
      return `
        <div class="glass-panel glass-panel-hover rounded-3xl overflow-hidden border border-white/5 flex flex-col justify-between shadow-xl">
          <div class="relative h-48 overflow-hidden group">
            <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div class="absolute top-3 left-3 bg-ocean-navy/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-tropical-teal/30 text-xs font-semibold text-tropical-teal">
              ${item.category} • ${item.duration}
            </div>
            <div class="absolute top-3 right-3 bg-ocean-navy/90 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 text-xs font-bold text-sand-warm flex items-center gap-1">
              <i data-lucide="star" class="w-3.5 h-3.5 fill-sand-warm"></i>
              ${item.rating}
            </div>
          </div>

          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <h4 class="text-base font-bold text-cloud-white mb-2 leading-snug line-clamp-2">${item.title}</h4>
              <p class="text-xs text-cloud-text line-clamp-2 mb-3">${item.description}</p>
            </div>

            <div class="pt-3 border-t border-white/5 flex items-center justify-between">
              <div>
                <span class="text-xs text-ocean-sky">Per person</span>
                <div class="text-lg font-extrabold text-cloud-white">${app.formatPrice(item.priceINR)}</div>
              </div>
              <button onclick="window.WanderBooking.openBookingModal('${item.id}', 'activities')" class="btn-primary-teal px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg">
                <span>Book Experience</span>
                <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    } else if (category === 'restaurants') {
      return `
        <div class="glass-panel glass-panel-hover rounded-3xl overflow-hidden border border-white/5 flex flex-col justify-between shadow-xl">
          <div class="relative h-48 overflow-hidden group">
            <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div class="absolute top-3 left-3 bg-ocean-navy/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-tropical-teal/30 text-xs font-semibold text-tropical-teal">
              ${item.cuisine}
            </div>
            <div class="absolute top-3 right-3 bg-ocean-navy/90 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 text-xs font-bold text-sand-warm flex items-center gap-1">
              <i data-lucide="star" class="w-3.5 h-3.5 fill-sand-warm"></i>
              ${item.rating}
            </div>
          </div>

          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <h4 class="text-base font-bold text-cloud-white mb-1.5">${item.name}</h4>
              <p class="text-xs text-cloud-text mb-2">🍽️ <strong>Specialty:</strong> ${item.specialty}</p>
              <div class="text-[11px] text-ocean-sky italic mb-3">"${item.ambiance}"</div>
            </div>

            <div class="pt-3 border-t border-white/5 flex items-center justify-between">
              <div>
                <span class="text-xs text-ocean-sky">Price Tier</span>
                <div class="text-sm font-bold text-cloud-white">${item.priceCategory}</div>
              </div>
              <button onclick="window.WanderBooking.openBookingModal('${item.id}', 'restaurants')" class="btn-primary-teal px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg">
                <span>Reserve Table</span>
                <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }

    return '';
  }

  openBookingModal(itemId, category) {
    const list = window.WANDER_DATA[category] || [];
    const item = list.find(i => i.id === itemId);
    if (!item) return;

    this.activeModalItem = { item, category };
    const modal = document.getElementById('bookingCheckoutModal');
    const content = document.getElementById('bookingModalDynamicContent');
    if (!modal || !content) return;

    const app = window.WanderApp;
    const basePriceINR = item.priceINR || item.pricePerNightINR || item.pricePerDayINR || 1500;
    const title = item.name || item.title || item.model || item.airline;

    content.innerHTML = `
      <div class="relative">
        <div class="flex items-start justify-between border-b border-white/10 pb-4 mb-5">
          <div>
            <div class="text-xs font-semibold text-tropical-teal uppercase tracking-wider">${category} Booking</div>
            <h3 class="text-xl font-bold text-cloud-white">${title}</h3>
          </div>
          <button onclick="window.WanderBooking.closeModal()" class="text-ocean-sky hover:text-cloud-white p-1">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <form id="activeCheckoutForm" onsubmit="window.WanderBooking.handleCheckoutSubmit(event)">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div>
              <label class="block text-xs font-medium text-cloud-text mb-1">Lead Traveler Name</label>
              <input type="text" required value="Alex Morgan" class="w-full bg-ocean-dark border border-white/10 rounded-xl px-3 py-2 text-sm text-cloud-white focus:border-tropical-teal focus:outline-none" />
            </div>
            <div>
              <label class="block text-xs font-medium text-cloud-text mb-1">Contact Email</label>
              <input type="email" required value="alex.traveler@wanderai.com" class="w-full bg-ocean-dark border border-white/10 rounded-xl px-3 py-2 text-sm text-cloud-white focus:border-tropical-teal focus:outline-none" />
            </div>
            <div>
              <label class="block text-xs font-medium text-cloud-text mb-1">Travel Date</label>
              <input type="date" required value="2026-09-15" class="w-full bg-ocean-dark border border-white/10 rounded-xl px-3 py-2 text-sm text-cloud-white focus:border-tropical-teal focus:outline-none" />
            </div>
            <div>
              <label class="block text-xs font-medium text-cloud-text mb-1">Guests / Quantity</label>
              <select id="modalGuestCount" onchange="window.WanderBooking.recalcModalPrice(${basePriceINR})" class="w-full bg-ocean-dark border border-white/10 rounded-xl px-3 py-2 text-sm text-cloud-white focus:border-tropical-teal focus:outline-none">
                <option value="1">1 Person / Unit</option>
                <option value="2" selected>2 Persons / Units</option>
                <option value="3">3 Persons / Units</option>
                <option value="4">4 Persons / Units</option>
              </select>
            </div>
          </div>

          <!-- Live Price Breakdown -->
          <div class="bg-ocean-dark/80 rounded-2xl p-4 border border-white/5 space-y-2 mb-6 text-xs">
            <div class="flex justify-between text-cloud-text">
              <span>Base Fare (x<span id="modalQtyDisplay">2</span>)</span>
              <span id="modalBaseFare">${app.formatPrice(basePriceINR * 2)}</span>
            </div>
            <div class="flex justify-between text-ocean-sky">
              <span>Taxes, Permits & Service Fees (8%)</span>
              <span id="modalTaxes">${app.formatPrice(Math.round(basePriceINR * 2 * 0.08))}</span>
            </div>
            <div class="flex justify-between text-tropical-teal">
              <span>🌱 100% Certified Carbon Offset</span>
              <span>Included Free</span>
            </div>
            <div class="pt-2 border-t border-white/10 flex justify-between text-sm font-extrabold text-cloud-white">
              <span>Total Payable</span>
              <span id="modalTotalPrice" class="text-tropical-teal text-base">${app.formatPrice(Math.round(basePriceINR * 2 * 1.08))}</span>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <button type="button" onclick="window.WanderBooking.closeModal()" class="w-1/3 py-2.5 rounded-xl bg-ocean-dark hover:bg-ocean-mid border border-white/10 text-xs font-semibold text-ocean-sky transition-colors">
              Cancel
            </button>
            <button type="submit" class="btn-primary-teal w-2/3 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg">
              <i data-lucide="shield-check" class="w-4 h-4"></i>
              <span>Confirm & Issue E-Ticket</span>
            </button>
          </div>
        </form>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
  }

  recalcModalPrice(unitPriceINR) {
    const qty = parseInt(document.getElementById('modalGuestCount')?.value || '2', 10);
    const app = window.WanderApp;
    const base = unitPriceINR * qty;
    const taxes = Math.round(base * 0.08);
    const total = base + taxes;

    const qtyDisp = document.getElementById('modalQtyDisplay');
    const baseDisp = document.getElementById('modalBaseFare');
    const taxDisp = document.getElementById('modalTaxes');
    const totalDisp = document.getElementById('modalTotalPrice');

    if (qtyDisp) qtyDisp.textContent = qty;
    if (baseDisp) baseDisp.textContent = app.formatPrice(base);
    if (taxDisp) taxDisp.textContent = app.formatPrice(taxes);
    if (totalDisp) totalDisp.textContent = app.formatPrice(total);
  }

  handleCheckoutSubmit(e) {
    e.preventDefault();
    if (!this.activeModalItem) return;

    const { item, category } = this.activeModalItem;
    const bookingRef = `WND-${Math.floor(100000 + Math.random() * 900000)}`;
    const guestQty = parseInt(document.getElementById('modalGuestCount')?.value || '2', 10);
    const unitPrice = item.priceINR || item.pricePerNightINR || item.pricePerDayINR || 1500;
    const totalPaidINR = Math.round(unitPrice * guestQty * 1.08);

    const newBooking = {
      bookingRef,
      category,
      itemId: item.id,
      title: item.name || item.title || item.model || item.airline,
      location: item.location || item.origin || 'Selected Destination',
      date: '2026-09-15',
      guests: guestQty,
      totalPaidINR: totalPaidINR,
      status: 'Confirmed & Guaranteed',
      bookedAt: new Date().toLocaleDateString(),
      image: item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80'
    };

    window.WanderApp.userBookings.unshift(newBooking);
    localStorage.setItem('wander_bookings', JSON.stringify(window.WanderApp.userBookings));
    window.WanderApp.updateBadgeCounts();

    // Show Confirmation Screen with Digital E-Ticket & QR code
    this.renderBookingConfirmation(newBooking);
    window.WanderApp.showToast(`🎉 Booking Confirmed! Ref: ${bookingRef}`, 'success');
    window.WanderApp.playChime();
  }

  renderBookingConfirmation(booking) {
    const content = document.getElementById('bookingModalDynamicContent');
    if (!content) return;

    content.innerHTML = `
      <div class="text-center py-2">
        <div class="w-14 h-14 mx-auto mb-3 rounded-full bg-tropical-teal/20 border border-tropical-teal/40 flex items-center justify-center text-tropical-teal">
          <i data-lucide="check" class="w-7 h-7"></i>
        </div>

        <h3 class="text-xl font-bold text-cloud-white mb-1">Booking Confirmed!</h3>
        <p class="text-xs text-ocean-sky mb-4">Your e-ticket and voucher pass have been issued.</p>

        <!-- Digital Boarding Pass / Voucher Card -->
        <div class="relative bg-gradient-to-br from-ocean-dark to-ocean-deep rounded-3xl p-5 border border-tropical-teal/30 text-left mb-5 shadow-2xl overflow-hidden">
          <div class="ticket-notch-left"></div>
          <div class="ticket-notch-right"></div>
          
          <div class="flex items-start justify-between border-b border-white/10 pb-3 mb-3">
            <div>
              <span class="text-[10px] text-tropical-teal font-bold uppercase tracking-wider">Official Pass</span>
              <h4 class="text-base font-bold text-cloud-white leading-tight">${booking.title}</h4>
            </div>
            <div class="text-right">
              <span class="text-[10px] text-ocean-sky">Reference ID</span>
              <div class="font-mono text-xs font-bold text-sand-warm">${booking.bookingRef}</div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 text-xs mb-4">
            <div>
              <span class="text-ocean-sky text-[10px] block">Location</span>
              <span class="text-cloud-white font-medium">${booking.location}</span>
            </div>
            <div>
              <span class="text-ocean-sky text-[10px] block">Travel Date</span>
              <span class="text-cloud-white font-medium">${booking.date}</span>
            </div>
            <div>
              <span class="text-ocean-sky text-[10px] block">Party Size</span>
              <span class="text-cloud-white font-medium">${booking.guests} Guests</span>
            </div>
            <div>
              <span class="text-ocean-sky text-[10px] block">Total Amount</span>
              <span class="text-tropical-teal font-bold">${window.WanderApp.formatPrice(booking.totalPaidINR)}</span>
            </div>
          </div>

          <!-- Simulated QR Code -->
          <div class="pt-3 border-t border-dashed border-white/15 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-12 h-12 bg-cloud-white p-1 rounded-xl flex items-center justify-center">
                <svg class="w-10 h-10 text-ocean-deep" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 2h2v4h-2v-4zm-4-2h2v2h-2v-2zm2 2h2v2h-2v-2zm2-2h2v2h-2v-2zm-4 4h4v2h-4v-2z"/>
                </svg>
              </div>
              <div class="text-[10px] text-ocean-sky">
                <span class="text-tropical-teal font-semibold block">Scan for Contactless Entry</span>
                <span>Synced to Apple/Google Wallet</span>
              </div>
            </div>
            <span class="text-[10px] px-2.5 py-1 rounded-full bg-tropical-teal/15 border border-tropical-teal/30 text-tropical-teal font-semibold">
              ✓ Verified
            </span>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button onclick="window.WanderBooking.syncToItinerary('${booking.bookingRef}')" class="flex-1 py-2.5 rounded-xl bg-ocean-dark hover:bg-ocean-mid border border-white/10 text-xs font-semibold text-tropical-teal flex items-center justify-center gap-1.5 transition-colors">
            <i data-lucide="calendar-plus" class="w-4 h-4"></i>
            <span>Add to Itinerary</span>
          </button>
          <button onclick="window.WanderBooking.viewInDashboard()" class="btn-primary-teal flex-1 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg">
            <i data-lucide="layout-dashboard" class="w-4 h-4"></i>
            <span>Go to Dashboard</span>
          </button>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  syncToItinerary(bookingRef) {
    const booking = window.WanderApp.userBookings.find(b => b.bookingRef === bookingRef);
    if (booking && window.WanderApp.activeItinerary) {
      const day1 = window.WanderApp.activeItinerary.days[0];
      if (day1) {
        day1.morning = {
          time: '08:30 AM',
          title: `Check-in / Depart: ${booking.title}`,
          category: 'Confirmed Booking',
          crowdLevel: 0,
          costINR: 0,
          location: booking.location,
          desc: `Confirmed pass reference #${booking.bookingRef}`,
          aiReason: 'Automatically synchronized from your verified WanderAI booking.'
        };
        window.WanderApp.saveActiveItinerary();
        window.WanderApp.showToast('✅ Synced booking into your active Trip Itinerary!', 'success');
        this.closeModal();
      }
    }
  }

  viewInDashboard() {
    this.closeModal();
    window.WanderApp.switchTab('dashboard');
  }

  closeModal() {
    const modal = document.getElementById('bookingCheckoutModal');
    if (modal) modal.classList.add('hidden');
    this.activeModalItem = null;
  }
}

// Global Booking Instance
document.addEventListener('DOMContentLoaded', () => {
  window.WanderBooking = new WanderBooking();
});
