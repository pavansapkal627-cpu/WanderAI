/**
 * WanderAI - Hidden Gems & "Escape the Crowd" Discovery Hub (Sunset Explorer Theme)
 * Explores secret spots, serene alternatives, crowd analytics,
 * and side-by-side tourist trap comparisons.
 */

class WanderHiddenGems {
  constructor() {
    this.activeFilter = 'All';
    this.searchQuery = '';
    this.activeComparisonIndex = 0;
    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Filter chip buttons
    document.querySelectorAll('.gem-filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const filter = pill.getAttribute('data-gem-filter');
        this.setFilter(filter);
      });
    });

    // Hidden Gems Search Bar
    const searchInput = document.getElementById('hiddenGemsSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        this.renderGems();
      });
    }
  }

  setFilter(filter) {
    this.activeFilter = filter;

    document.querySelectorAll('.gem-filter-pill').forEach(pill => {
      const isCurrent = pill.getAttribute('data-gem-filter') === filter;
      pill.classList.toggle('bg-tropical-teal', isCurrent);
      pill.classList.toggle('text-ocean-deep', isCurrent);
      pill.classList.toggle('font-black', isCurrent);
      pill.classList.toggle('bg-ocean-dark/80', !isCurrent);
      pill.classList.toggle('text-ocean-sky', !isCurrent);
    });

    this.renderGems();
  }

  renderGems() {
    this.renderEscapeTheCrowdHero();
    this.renderGemsGrid();
  }

  renderEscapeTheCrowdHero() {
    const container = document.getElementById('escapeTheCrowdComparisonContainer');
    if (!container) return;

    const pairs = window.WANDER_DATA.escapeTheCrowd;
    const pair = pairs[this.activeComparisonIndex] || pairs[0];
    const app = window.WanderApp;

    container.innerHTML = `
      <div class="glass-panel rounded-3xl p-6 md:p-8 border border-white/10 relative overflow-hidden mb-12 shadow-2xl">
        <div class="hero-glow-mesh"></div>
        <div class="relative z-10">
          
          <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ocean-navy/90 border border-tropical-teal/35 text-tropical-teal text-xs font-semibold mb-2">
                <i data-lucide="shield-alert" class="w-3.5 h-3.5 text-tropical-teal"></i>
                WanderAI Signature Engine: Escape the Crowd™
              </div>
              <h3 class="text-2xl font-black text-cloud-white">Compare Hotspots vs. Tranquil Alternatives</h3>
              <p class="text-xs text-ocean-sky">Discover identical or superior vibes with up to 90% fewer tourists.</p>
            </div>

            <!-- Switcher Buttons -->
            <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              ${pairs.map((p, idx) => `
                <button onclick="window.WanderHiddenGems.selectComparison(${idx})" class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  this.activeComparisonIndex === idx
                    ? 'btn-primary-teal shadow-md'
                    : 'bg-ocean-dark/80 text-ocean-sky hover:text-cloud-white border border-white/5'
                }">
                  ${p.popularSpot.location.split(',')[0]}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Side-by-Side Arena -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            
            <!-- Left: Crowded Hotspot -->
            <div class="bg-sunset-coral/10 rounded-3xl p-5 border border-sunset-coral/25 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <span class="px-2.5 py-1 rounded-xl bg-sunset-coral/20 text-sunset-coral text-xs font-bold border border-sunset-coral/30 flex items-center gap-1">
                    <i data-lucide="alert-triangle" class="w-3 h-3"></i>
                    Tourist Trap Alert
                  </span>
                  <span class="text-xs text-sunset-coral font-bold">Crowd: ${pair.popularSpot.crowdLevel}% (Congested)</span>
                </div>

                <div class="relative h-48 rounded-2xl overflow-hidden mb-3">
                  <img src="${pair.popularSpot.image}" alt="${pair.popularSpot.name}" class="w-full h-full object-cover grayscale-[20%]" />
                  <div class="absolute inset-0 bg-gradient-to-t from-ocean-deep via-transparent to-transparent"></div>
                  <div class="absolute bottom-3 left-3 right-3">
                    <h4 class="text-base font-bold text-cloud-white leading-tight">${pair.popularSpot.name}</h4>
                    <span class="text-xs text-ocean-sky">${pair.popularSpot.location}</span>
                  </div>
                </div>

                <div class="space-y-2 text-xs mb-4">
                  <div class="flex items-center gap-2 text-sunset-coral bg-ocean-navy/80 p-2.5 rounded-xl border border-sunset-coral/15 font-medium">
                    <i data-lucide="clock" class="w-3.5 h-3.5 flex-shrink-0"></i>
                    <span><strong>Avg. Wait Time:</strong> ${pair.popularSpot.avgWaitTime}</span>
                  </div>
                  <div class="flex items-start gap-2 text-cloud-text bg-ocean-navy/80 p-2.5 rounded-xl border border-white/5">
                    <i data-lucide="frown" class="w-3.5 h-3.5 text-sunset-coral flex-shrink-0 mt-0.5"></i>
                    <span>${pair.popularSpot.drawback}</span>
                  </div>
                </div>
              </div>

              <div class="text-[11px] text-ocean-sky italic">
                AI Tip: Avoid during midday peak hours.
              </div>
            </div>

            <!-- Right: AI Tranquil Alternative -->
            <div class="bg-tropical-teal/10 rounded-3xl p-5 border-2 border-tropical-teal/40 flex flex-col justify-between relative shadow-xl shadow-tropical-teal/10">
              <div class="absolute -top-3 right-6 bg-gradient-to-r from-tropical-teal to-sunset-coral text-ocean-deep font-black text-[10px] uppercase tracking-wider px-3 py-0.5 rounded-full shadow-lg">
                ★ 90% Fewer Crowds
              </div>

              <div>
                <div class="flex items-center justify-between mb-3">
                  <span class="px-2.5 py-1 rounded-xl bg-tropical-teal/20 text-tropical-teal text-xs font-bold border border-tropical-teal/40 flex items-center gap-1">
                    <i data-lucide="sparkles" class="w-3 h-3 text-tropical-teal"></i>
                    Serene Hidden Alternative
                  </span>
                  <span class="text-xs text-tropical-teal font-bold">Serenity Score: ${pair.hiddenAlternative.serenityScore}/100</span>
                </div>

                <div class="relative h-48 rounded-2xl overflow-hidden mb-3 group">
                  <img src="${pair.hiddenAlternative.image}" alt="${pair.hiddenAlternative.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div class="absolute inset-0 bg-gradient-to-t from-ocean-deep via-transparent to-transparent"></div>
                  <div class="absolute bottom-3 left-3 right-3">
                    <h4 class="text-base font-bold text-cloud-white leading-tight">${pair.hiddenAlternative.name}</h4>
                    <span class="text-xs text-tropical-teal font-semibold">${pair.hiddenAlternative.location}</span>
                  </div>
                </div>

                <div class="space-y-2 text-xs mb-4">
                  <div class="bg-ocean-navy/90 p-2.5 rounded-xl border border-tropical-teal/20 text-cloud-text">
                    <strong class="text-tropical-teal">Why AI Recommends This:</strong> ${pair.hiddenAlternative.whyBetter}
                  </div>
                  <div class="grid grid-cols-2 gap-2 text-[11px]">
                    <div class="bg-ocean-navy/80 p-2 rounded-xl border border-white/5 text-cloud-text">
                      🌅 <strong>Best Arrival:</strong> ${pair.hiddenAlternative.bestTime}
                    </div>
                    <div class="bg-ocean-navy/80 p-2 rounded-xl border border-white/5 text-cloud-text truncate">
                      🚕 <strong>Transit:</strong> ${pair.hiddenAlternative.travelTimeFromCenter}
                    </div>
                  </div>
                </div>
              </div>

              <div class="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                <div>
                  <span class="text-[10px] text-ocean-sky">Entry / Cost</span>
                  <div class="text-sm font-extrabold text-cloud-white">${pair.hiddenAlternative.estimatedCostINR === 0 ? 'Free Entry' : app.formatPrice(pair.hiddenAlternative.estimatedCostINR)}</div>
                </div>

                <button onclick="window.WanderHiddenGems.replaceInTrip('${pair.id}')" class="btn-primary-teal px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg">
                  <i data-lucide="check" class="w-3.5 h-3.5"></i>
                  <span>Switch to This in My Trip</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  selectComparison(idx) {
    this.activeComparisonIndex = idx;
    this.renderEscapeTheCrowdHero();
  }

  replaceInTrip(pairId) {
    const pair = window.WANDER_DATA.escapeTheCrowd.find(p => p.id === pairId);
    if (!pair || !window.WanderApp.activeItinerary) return;

    const day = window.WanderApp.activeItinerary.days[0];
    if (day) {
      day.morning = {
        time: '08:30 AM',
        title: pair.hiddenAlternative.name,
        category: 'Escape Crowd Gem',
        crowdLevel: pair.hiddenAlternative.crowdLevel,
        costINR: pair.hiddenAlternative.estimatedCostINR,
        location: pair.hiddenAlternative.location,
        coordinates: pair.hiddenAlternative.coordinates,
        desc: pair.hiddenAlternative.whyBetter,
        aiReason: `Serenity score: ${pair.hiddenAlternative.serenityScore}/100. Best arrival window: ${pair.hiddenAlternative.bestTime}`
      };
      window.WanderApp.saveActiveItinerary();
      window.WanderApp.showToast(`🌿 Switched to "${pair.hiddenAlternative.name}" in your Trip Plan!`, 'success');
      window.WanderApp.playChime();
    }
  }

  renderGemsGrid() {
    const container = document.getElementById('hiddenGemsGridContainer');
    if (!container) return;

    let gems = window.WANDER_DATA.hiddenGems;
    const app = window.WanderApp;

    if (this.activeFilter !== 'All') {
      gems = gems.filter(g => g.filterTags?.includes(this.activeFilter) || g.category === this.activeFilter);
    }

    if (this.searchQuery) {
      gems = gems.filter(g => 
        g.name.toLowerCase().includes(this.searchQuery) ||
        g.location.toLowerCase().includes(this.searchQuery) ||
        g.whyAiRecommends.toLowerCase().includes(this.searchQuery)
      );
    }

    if (gems.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-16 glass-panel rounded-3xl p-8 border border-white/5">
          <i data-lucide="compass" class="w-12 h-12 text-ocean-sky mx-auto mb-3"></i>
          <h4 class="text-lg font-bold text-cloud-white mb-1">No secret spots match your filter</h4>
          <p class="text-xs text-ocean-sky">Try selecting 'All' or searching for another keyword.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    container.innerHTML = gems.map(gem => {
      const isSaved = app.savedGems.includes(gem.id);

      return `
        <div class="glass-panel glass-panel-hover rounded-3xl overflow-hidden border border-white/5 flex flex-col justify-between shadow-xl">
          <div class="relative h-56 overflow-hidden group">
            <img src="${gem.image}" alt="${gem.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-ocean-deep/85 via-transparent to-transparent"></div>
            
            <div class="absolute top-3 left-3 bg-ocean-navy/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-tropical-teal/30 text-xs font-semibold text-tropical-teal">
              ${gem.category}
            </div>

            <!-- Wishlist Heart -->
            <button onclick="window.WanderApp.toggleSaveGem('${gem.id}')" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-ocean-navy/80 backdrop-blur-md border border-white/10 flex items-center justify-center transition-transform hover:scale-110 ${
              isSaved ? 'text-sunset-coral' : 'text-ocean-sky hover:text-cloud-white'
            }">
              <i data-lucide="heart" class="w-4 h-4 ${isSaved ? 'fill-sunset-coral' : ''}"></i>
            </button>

            <!-- Crowd Meter Badge -->
            <div class="absolute bottom-3 left-3 right-3 bg-ocean-navy/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-tropical-teal/30 flex items-center justify-between text-xs">
              <div class="flex items-center gap-1.5 text-tropical-teal font-semibold">
                <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
                <span>Crowd: <strong>${gem.crowdLevel}%</strong> (Serene)</span>
              </div>
              <div class="text-sand-warm font-bold">
                ★ ${gem.uniquenessScore}
              </div>
            </div>
          </div>

          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div class="text-xs text-ocean-sky mb-1 flex items-center gap-1">
                <i data-lucide="map-pin" class="w-3 h-3 text-tropical-teal"></i>
                ${gem.location}
              </div>
              <h4 class="text-base font-bold text-cloud-white mb-2 leading-snug">${gem.name}</h4>
              
              <p class="text-xs text-cloud-text mb-3 leading-relaxed">${gem.whyAiRecommends}</p>

              <!-- Tip Box -->
              <div class="bg-ocean-navy/80 rounded-2xl p-2.5 border border-tropical-teal/20 text-[11px] text-cloud-text mb-4">
                <strong class="text-tropical-teal">💡 Insider Tip:</strong> ${gem.insiderTip}
              </div>

              <div class="grid grid-cols-2 gap-2 text-[11px] text-ocean-sky mb-4 bg-ocean-dark/60 p-2 rounded-xl border border-white/5">
                <div class="truncate">⏰ <strong>Best:</strong> ${gem.bestTime}</div>
                <div class="truncate">🚗 <strong>Transit:</strong> ${gem.travelTime}</div>
              </div>
            </div>

            <div class="pt-3 border-t border-white/5 flex items-center justify-between">
              <div>
                <span class="text-[10px] text-ocean-sky">Estimated Cost</span>
                <div class="text-sm font-extrabold text-cloud-white">
                  ${gem.estimatedCostINR === 0 ? 'Free Entry' : app.formatPrice(gem.estimatedCostINR)}
                </div>
              </div>

              <button onclick="window.WanderHiddenGems.addGemToActiveItinerary('${gem.id}')" class="btn-primary-teal px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg">
                <i data-lucide="plus-circle" class="w-3.5 h-3.5"></i>
                <span>Add to Trip</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  addGemToActiveItinerary(gemId) {
    const gem = window.WANDER_DATA.hiddenGems.find(g => g.id === gemId);
    if (!gem || !window.WanderApp.activeItinerary) return;

    const day = window.WanderApp.activeItinerary.days[0];
    if (day) {
      day.evening = {
        time: '05:00 PM',
        title: gem.name,
        category: 'Added Hidden Gem',
        crowdLevel: gem.crowdLevel,
        costINR: gem.estimatedCostINR,
        location: gem.location,
        coordinates: gem.coordinates,
        desc: gem.whyAiRecommends,
        aiReason: gem.insiderTip
      };
      window.WanderApp.saveActiveItinerary();
      window.WanderApp.showToast(`✨ Added "${gem.name}" to your Trip Itinerary!`, 'success');
      window.WanderApp.playChime();
    }
  }
}

// Global Hidden Gems Instance
document.addEventListener('DOMContentLoaded', () => {
  window.WanderHiddenGems = new WanderHiddenGems();
});
