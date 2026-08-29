/**
 * WanderAI - User Dashboard ("My WanderHub") & Budget Tracker (Sunset Explorer Theme)
 * Manages user itineraries, confirmed booking vouchers, saved hidden gems,
 * gamified travel stats, and real-time budget breakdown analytics.
 */

class WanderDashboard {
  constructor() {
    this.init();
  }

  init() {
    // Initialized when user enters the dashboard tab
  }

  renderDashboard() {
    const container = document.getElementById('dashboardMainContainer');
    if (!container) return;

    const app = window.WanderApp;
    const activeItinerary = app.activeItinerary;
    const bookings = app.userBookings || [];
    const savedGemIds = app.savedGems || [];
    const allGems = window.WANDER_DATA.hiddenGems;
    const savedGemsList = allGems.filter(g => savedGemIds.includes(g.id));

    // Calculate budget statistics
    const targetBudgetINR = activeItinerary?.totalBudgetINR || 120000;
    let totalBookedINR = 0;
    bookings.forEach(b => { totalBookedINR += (b.totalPaidINR || 0); });

    let estActivitiesINR = 0;
    if (activeItinerary?.days) {
      activeItinerary.days.forEach(d => {
        ['morning', 'afternoon', 'evening', 'night'].forEach(slot => {
          if (d[slot]) estActivitiesINR += (d[slot].costINR || 0);
        });
      });
    }

    const totalCommittedINR = totalBookedINR + estActivitiesINR;
    const remainingBudgetINR = Math.max(0, targetBudgetINR - totalCommittedINR);
    const budgetPercentUsed = Math.min(100, Math.round((totalCommittedINR / targetBudgetINR) * 100));

    container.innerHTML = `
      <!-- User Profile & Gamified Stats Header -->
      <div class="glass-panel rounded-3xl p-6 md:p-8 border border-white/10 mb-8 relative overflow-hidden shadow-2xl">
        <div class="hero-glow-mesh"></div>
        <div class="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-tropical-teal via-ocean-blue to-sunset-coral p-0.5 shadow-xl shadow-tropical-teal/20">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" alt="Alex Morgan" class="w-full h-full object-cover rounded-2xl" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-xl font-bold text-cloud-white">Alex Morgan</h3>
                <span class="px-2.5 py-0.5 rounded-full bg-tropical-teal/15 border border-tropical-teal/40 text-[11px] font-bold text-tropical-teal">
                  Mindful Explorer Pro
                </span>
              </div>
              <p class="text-xs text-ocean-sky mt-0.5">Primary Travel Style: <strong class="text-tropical-teal">Offbeat, Cultural & Serene</strong></p>
            </div>
          </div>

          <!-- Quick Stats Pills -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="bg-ocean-dark/80 p-3 rounded-2xl border border-white/5 text-center min-w-[100px]">
              <div class="text-base font-extrabold text-tropical-teal">88%</div>
              <div class="text-[10px] text-ocean-sky">Crowds Avoided</div>
            </div>
            <div class="bg-ocean-dark/80 p-3 rounded-2xl border border-white/5 text-center min-w-[100px]">
              <div class="text-base font-extrabold text-sand-warm">${savedGemsList.length}</div>
              <div class="text-[10px] text-ocean-sky">Saved Gems</div>
            </div>
            <div class="bg-ocean-dark/80 p-3 rounded-2xl border border-white/5 text-center min-w-[100px]">
              <div class="text-base font-extrabold text-sunset-coral">${bookings.length}</div>
              <div class="text-[10px] text-ocean-sky">Confirmed Passes</div>
            </div>
            <div class="bg-ocean-dark/80 p-3 rounded-2xl border border-white/5 text-center min-w-[100px]">
              <div class="text-base font-extrabold text-cloud-white">${app.formatPrice(32000)}</div>
              <div class="text-[10px] text-ocean-sky">AI Saved Money</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Real-Time Travel Budget Tracker -->
      <div class="glass-panel rounded-3xl p-6 md:p-8 border border-white/10 mb-8 shadow-2xl">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div class="text-xs font-semibold text-tropical-teal uppercase tracking-wider">Financial Insights</div>
            <h4 class="text-xl font-bold text-cloud-white">Live Travel Budget Tracker</h4>
          </div>
          <div class="text-right">
            <span class="text-xs text-ocean-sky">Target Budget Limit:</span>
            <div class="text-lg font-extrabold text-cloud-white">${app.formatPrice(targetBudgetINR)}</div>
          </div>
        </div>

        <!-- Budget Gauge Bar -->
        <div class="mb-4">
          <div class="flex justify-between text-xs font-semibold mb-2">
            <span class="text-cloud-text">Committed & Booked: <strong class="text-tropical-teal">${app.formatPrice(totalCommittedINR)}</strong></span>
            <span class="${remainingBudgetINR > 0 ? 'text-tropical-teal font-bold' : 'text-sunset-coral font-bold'}">
              ${remainingBudgetINR > 0 ? `Buffer Remaining: ${app.formatPrice(remainingBudgetINR)}` : 'Budget Limit Exceeded'}
            </span>
          </div>
          <div class="w-full bg-ocean-dark rounded-full h-3.5 overflow-hidden p-0.5 border border-white/10 flex">
            <div style="width: ${budgetPercentUsed}%;" class="h-full bg-gradient-to-r from-tropical-teal via-ocean-blue to-sunset-coral rounded-full transition-all duration-500"></div>
          </div>
        </div>

        <!-- Breakdown Categories -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/5 text-xs">
          <div class="bg-ocean-dark/60 p-3.5 rounded-2xl border border-white/5">
            <div class="text-ocean-sky mb-1 flex items-center gap-1.5">
              <i data-lucide="ticket" class="w-3.5 h-3.5 text-tropical-teal"></i>
              <span>Bookings & Passes</span>
            </div>
            <div class="text-base font-bold text-cloud-white">${app.formatPrice(totalBookedINR)}</div>
          </div>

          <div class="bg-ocean-dark/60 p-3.5 rounded-2xl border border-white/5">
            <div class="text-ocean-sky mb-1 flex items-center gap-1.5">
              <i data-lucide="compass" class="w-3.5 h-3.5 text-sand-warm"></i>
              <span>Planned Day Activities</span>
            </div>
            <div class="text-base font-bold text-cloud-white">${app.formatPrice(estActivitiesINR)}</div>
          </div>

          <div class="bg-ocean-dark/60 p-3.5 rounded-2xl border border-white/5">
            <div class="text-ocean-sky mb-1 flex items-center gap-1.5">
              <i data-lucide="shield-check" class="w-3.5 h-3.5 text-tropical-teal"></i>
              <span>Available Surplus Buffer</span>
            </div>
            <div class="text-base font-bold text-tropical-teal">${app.formatPrice(remainingBudgetINR)}</div>
          </div>
        </div>
      </div>

      <!-- Main Dashboard Two-Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        <!-- Left: Active Upcoming Trip -->
        <div class="glass-panel rounded-3xl p-6 border border-white/10 flex flex-col justify-between shadow-xl">
          <div>
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-lg font-bold text-cloud-white flex items-center gap-2">
                <i data-lucide="plane-takeoff" class="w-5 h-5 text-tropical-teal"></i>
                <span>Active AI Trip Itinerary</span>
              </h4>
              <span class="px-2.5 py-0.5 rounded-full bg-tropical-teal/15 border border-tropical-teal/30 text-tropical-teal text-xs font-semibold">
                In 21 Days
              </span>
            </div>

            ${activeItinerary ? `
              <div class="relative h-44 rounded-2xl overflow-hidden mb-4 group">
                <img src="${activeItinerary.coverImage}" alt="${activeItinerary.destination}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div class="absolute inset-0 bg-gradient-to-t from-ocean-deep via-ocean-deep/30 to-transparent"></div>
                <div class="absolute bottom-3 left-3 right-3">
                  <div class="text-xs text-tropical-teal font-bold uppercase tracking-wider">${activeItinerary.destination}</div>
                  <h5 class="text-base font-bold text-cloud-white leading-tight">${activeItinerary.tripTitle}</h5>
                </div>
              </div>

              <div class="space-y-2 text-xs text-cloud-text mb-4">
                <div class="flex justify-between py-1 border-b border-white/5">
                  <span class="text-ocean-sky">Duration</span>
                  <span class="text-cloud-white font-medium">${activeItinerary.daysCount} Days Personalized Plan</span>
                </div>
                <div class="flex justify-between py-1 border-b border-white/5">
                  <span class="text-ocean-sky">Travelers</span>
                  <span class="text-cloud-white font-medium">${activeItinerary.travelers}</span>
                </div>
                <div class="flex justify-between py-1 border-b border-white/5">
                  <span class="text-ocean-sky">Travel Style</span>
                  <span class="text-tropical-teal font-medium">${activeItinerary.style}</span>
                </div>
              </div>
            ` : `
              <p class="text-xs text-ocean-sky py-8 text-center">No active trip yet. Start planning in the AI Trip Planner!</p>
            `}
          </div>

          <div class="flex items-center gap-3 pt-3 border-t border-white/5">
            <button onclick="window.WanderApp.switchTab('planner')" class="btn-primary-teal flex-1 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg">
              <i data-lucide="edit-3" class="w-4 h-4"></i>
              <span>Open & Edit Plan</span>
            </button>
            <button onclick="window.WanderApp.switchTab('map')" class="btn-secondary-ocean flex-1 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5">
              <i data-lucide="map" class="w-4 h-4 text-tropical-teal"></i>
              <span>View Route Map</span>
            </button>
          </div>
        </div>

        <!-- Right: Confirmed Bookings & E-Tickets -->
        <div class="glass-panel rounded-3xl p-6 border border-white/10 flex flex-col justify-between shadow-xl">
          <div>
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-lg font-bold text-cloud-white flex items-center gap-2">
                <i data-lucide="ticket" class="w-5 h-5 text-sunset-coral"></i>
                <span>Confirmed Passes & E-Tickets</span>
              </h4>
              <span class="text-xs text-ocean-sky">${bookings.length} Passes</span>
            </div>

            <div class="space-y-3 max-h-72 overflow-y-auto pr-1">
              ${bookings.length > 0 ? bookings.map(b => `
                <div class="p-3 bg-ocean-dark/70 rounded-2xl border border-white/5 flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <img src="${b.image}" alt="${b.title}" class="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                    <div>
                      <h5 class="text-xs font-bold text-cloud-white leading-tight line-clamp-1">${b.title}</h5>
                      <span class="text-[10px] text-ocean-sky block">${b.location} • Ref: <strong class="text-sand-warm">${b.bookingRef}</strong></span>
                      <span class="text-[10px] text-tropical-teal font-semibold">✓ ${b.status}</span>
                    </div>
                  </div>
                  <div class="text-right flex-shrink-0">
                    <div class="text-xs font-extrabold text-cloud-white">${app.formatPrice(b.totalPaidINR)}</div>
                    <span class="text-[10px] text-ocean-sky">${b.date}</span>
                  </div>
                </div>
              `).join('') : `
                <div class="text-center py-10 text-ocean-sky text-xs">
                  <i data-lucide="ticket-slash" class="w-8 h-8 mx-auto mb-2 text-ocean-mid"></i>
                  <span>No confirmed bookings yet. Browse hotels, flights, or activities to book!</span>
                </div>
              `}
            </div>
          </div>

          <div class="pt-3 border-t border-white/5">
            <button onclick="window.WanderApp.switchTab('booking')" class="w-full py-2.5 rounded-xl bg-ocean-dark hover:bg-ocean-mid border border-white/10 text-tropical-teal font-bold text-xs flex items-center justify-center gap-1.5 transition-colors">
              <i data-lucide="search" class="w-4 h-4"></i>
              <span>Search More Bookings</span>
            </button>
          </div>
        </div>

      </div>

      <!-- Saved Hidden Gems Wishlist -->
      <div class="glass-panel rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl">
        <div class="flex items-center justify-between mb-6">
          <div>
            <div class="text-xs font-semibold text-tropical-teal uppercase tracking-wider">Wishlist</div>
            <h4 class="text-xl font-bold text-cloud-white">Saved Secret Spots (${savedGemsList.length})</h4>
          </div>
          <button onclick="window.WanderApp.switchTab('hidden-gems')" class="text-xs font-semibold text-tropical-teal hover:text-tropical-hover flex items-center gap-1">
            <span>Explore All</span>
            <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          ${savedGemsList.map(gem => `
            <div class="bg-ocean-dark/70 rounded-2xl overflow-hidden border border-white/5 p-3 flex items-center gap-3 group">
              <img src="${gem.image}" alt="${gem.name}" class="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
              <div class="flex-1 min-w-0">
                <h5 class="text-xs font-bold text-cloud-white leading-tight truncate group-hover:text-tropical-teal transition-colors">${gem.name}</h5>
                <span class="text-[10px] text-ocean-sky block truncate">${gem.location}</span>
                <div class="flex items-center justify-between mt-1.5">
                  <span class="text-[10px] text-tropical-teal font-semibold">Crowd: ${gem.crowdLevel}%</span>
                  <button onclick="window.WanderHiddenGems.addGemToActiveItinerary('${gem.id}')" class="text-[10px] px-2 py-0.5 rounded-lg bg-tropical-teal/20 text-tropical-teal hover:bg-tropical-teal hover:text-ocean-deep font-bold transition-colors">
                    + Add to Trip
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }
}

// Global Dashboard Instance
document.addEventListener('DOMContentLoaded', () => {
  window.WanderDashboard = new WanderDashboard();
});
