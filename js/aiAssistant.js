/**
 * WanderAI - Conversational AI Travel Assistant ("WanderAI Copilot")
 * Sunset Explorer Theme: Context-aware copilot understanding worldwide destinations,
 * budget optimizations, and live itinerary modifications.
 */

class WanderAIAssistant {
  constructor() {
    this.isOpen = false;
    this.isTyping = false;
    this.messages = [
      {
        sender: 'ai',
        text: "👋 Hi! I'm your WanderAI Copilot. Ask me anything like *'Plan a 4-day trip to Japan'*, *'Find peaceful places near Mumbai/Pune'*, *'Plan a ₹30,000 trip'*, or *'Escape crowds at Eiffel Tower'* — I can even modify your active trip plan directly!",
        action: null
      }
    ];
    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    const toggleBtn = document.getElementById('openAiCopilotBtn');
    const closeBtn = document.getElementById('closeAiCopilotBtn');
    const drawer = document.getElementById('aiCopilotDrawer');

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggleDrawer());
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.toggleDrawer(false));
    }

    const form = document.getElementById('aiCopilotForm');
    const input = document.getElementById('aiCopilotInput');
    if (form && input) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (text && !this.isTyping) {
          input.value = '';
          this.handleUserMessage(text);
        }
      });
    }

    document.querySelectorAll('.ai-prompt-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const promptText = chip.getAttribute('data-prompt') || chip.textContent.trim();
        this.handleUserMessage(promptText);
      });
    });
  }

  toggleDrawer(forceState = null) {
    this.isOpen = forceState !== null ? forceState : !this.isOpen;
    const drawer = document.getElementById('aiCopilotDrawer');
    if (!drawer) return;

    if (this.isOpen) {
      drawer.classList.remove('translate-x-full', 'opacity-0', 'pointer-events-none');
      drawer.classList.add('translate-x-0', 'opacity-100');
      this.renderMessages();
      document.getElementById('aiCopilotInput')?.focus();
    } else {
      drawer.classList.add('translate-x-full', 'opacity-0', 'pointer-events-none');
      drawer.classList.remove('translate-x-0', 'opacity-100');
    }
  }

  handleUserMessage(userText) {
    this.messages.push({ sender: 'user', text: userText });
    this.renderMessages();
    this.isTyping = true;
    this.showTypingIndicator();

    setTimeout(() => {
      const response = this.generateAIResponse(userText);
      this.isTyping = false;
      this.hideTypingIndicator();
      this.messages.push(response);
      this.renderMessages();
      window.WanderApp.playChime();
    }, 800);
  }

  showTypingIndicator() {
    const container = document.getElementById('aiCopilotMessagesContainer');
    if (!container) return;

    const indicator = document.createElement('div');
    indicator.id = 'aiTypingIndicator';
    indicator.className = 'flex items-start gap-2.5';
    indicator.innerHTML = `
      <div class="w-7 h-7 rounded-2xl bg-tropical-teal/20 border border-tropical-teal/40 flex items-center justify-center text-tropical-teal text-xs flex-shrink-0">
        <i data-lucide="sparkles" class="w-3.5 h-3.5 animate-spin"></i>
      </div>
      <div class="bg-ocean-dark/90 border border-white/10 rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-xs text-tropical-teal flex items-center gap-1.5 shadow-md">
        <span class="w-1.5 h-1.5 rounded-full bg-tropical-teal animate-bounce"></span>
        <span class="w-1.5 h-1.5 rounded-full bg-tropical-teal animate-bounce [animation-delay:0.2s]"></span>
        <span class="w-1.5 h-1.5 rounded-full bg-tropical-teal animate-bounce [animation-delay:0.4s]"></span>
        <span class="ml-1 text-ocean-sky">Synthesizing worldwide travel graph...</span>
      </div>
    `;
    container.appendChild(indicator);
    if (window.lucide) window.lucide.createIcons();
    container.scrollTop = container.scrollHeight;
  }

  hideTypingIndicator() {
    const indicator = document.getElementById('aiTypingIndicator');
    if (indicator) indicator.remove();
  }

  generateAIResponse(query) {
    const q = query.toLowerCase();
    const activeLoc = window.WanderLocationService?.activeLocation?.name || 'Kyoto';

    // 1. "Mumbai" / "Pune" / "Peaceful places near Mumbai"
    if (q.includes('mumbai') || q.includes('pune') || q.includes('matheran') || q.includes('maharashtra')) {
      return {
        sender: 'ai',
        text: `For peaceful escapes near Mumbai/Pune, bypass crowded Lonavala! I recommend **Matheran Eco Forest** (Asia’s only automobile-free hill station with red clay paths) or **Tamhini Ghat secluded waterfalls**. Pure tranquil nature with zero traffic noise.`,
        action: {
          type: 'plan_matheran',
          btnText: '🏔️ Plan 3-Day Matheran Eco Trip',
          callback: () => {
            if (window.WanderLocationService) {
              const matheran = window.WanderLocationService.curatedWorldwideLocations.find(l => l.name === 'Matheran');
              if (matheran) window.WanderLocationService.selectLocation(matheran);
            }
            if (window.WanderPlanner) {
              window.WanderPlanner.generateTripPlan({ days: 3, budget: 20000 });
              window.WanderApp.switchTab('planner');
            }
          }
        }
      };
    }

    // 2. "Japan" / "4-day trip"
    if (q.includes('japan') || q.includes('tokyo') || q.includes('kyoto')) {
      return {
        sender: 'ai',
        text: `Here is a custom 4-day plan for **Kyoto & Kansai Region**! Features traditional Machiya stays, private sub-temple tea ceremonies in Daitoku-ji, and peaceful night walks through vermilion shrines without tour bus congestion.`,
        action: {
          type: 'plan_japan',
          btnText: '⛩️ Load 4-Day Kyoto Trip Plan',
          callback: () => {
            if (window.WanderLocationService) {
              const kyoto = window.WanderLocationService.curatedWorldwideLocations.find(l => l.name === 'Kyoto');
              if (kyoto) window.WanderLocationService.selectLocation(kyoto);
            }
            if (window.WanderPlanner) {
              window.WanderPlanner.generateTripPlan({ days: 4, budget: 120000 });
              window.WanderApp.switchTab('planner');
            }
          }
        }
      };
    }

    // 3. "30,000" / "Budget" / "Make cheaper"
    if (q.includes('30,000') || q.includes('30000') || q.includes('cheap') || q.includes('budget')) {
      return {
        sender: 'ai',
        text: `I've optimized your budget constraints! For under **₹30,000**, destinations like **Matheran Eco Forest**, **South Goa Secret Coves**, or **Udaipur Heritage Havelis** offer world-class luxury boutique experiences by utilizing direct trains and authentic family taverns.`,
        action: {
          type: 'optimize_budget',
          btnText: '💰 Apply Budget Optimization',
          callback: () => {
            if (window.WanderPlanner) {
              window.WanderPlanner.optimizePlan('budget');
              window.WanderApp.switchTab('planner');
            }
          }
        }
      };
    }

    // 4. "Alternatives to crowded" / "Escape crowd"
    if (q.includes('alternative') || q.includes('crowd') || q.includes('tourist') || q.includes('escape')) {
      return {
        sender: 'ai',
        text: `Our **Escape the Crowd™ Engine** matches popular crowded hotspots with nearby serene alternatives:
- **Eiffel Tower** ➔ *Parc des Buttes-Chaumont Temple* (90% fewer tourists)
- **Fushimi Inari** ➔ *Otagi Nenbutsu-ji Moss Statues* (98% serenity)
- **Taj Mahal Gate** ➔ *Mehtab Bagh Moonlight Garden Reflection*`,
        action: {
          type: 'view_escape_crowd',
          btnText: '🛡️ Open Escape-the-Crowd Comparison Hub',
          callback: () => {
            window.WanderApp.switchTab('hidden-gems');
          }
        }
      };
    }

    // 5. "Family" / "Kids"
    if (q.includes('family') || q.includes('kids') || q.includes('child')) {
      return {
        sender: 'ai',
        text: `For family travel, I recommend spacious nature-friendly spots with minimal transit friction: **Swiss Alps (Lauterbrunnen)** with scenic cable cars, or **South Goa** with gentle calm swimming coves and dolphin boat trips.`,
        action: null
      };
    }

    // Default Fallback
    return {
      sender: 'ai',
      text: `I've analyzed your question against our worldwide travel database for **${activeLoc}**. Would you like me to optimize your active day-by-day plan or discover secret spots on the interactive map?`,
      action: {
        type: 'explore_gems',
        btnText: '🗺️ Explore Interactive Route Map',
        callback: () => {
          window.WanderApp.switchTab('map');
        }
      }
    };
  }

  renderMessages() {
    const container = document.getElementById('aiCopilotMessagesContainer');
    if (!container) return;

    container.innerHTML = this.messages.map((msg, idx) => {
      if (msg.sender === 'user') {
        return `
          <div class="flex items-end justify-end gap-2">
            <div class="btn-primary-teal rounded-2xl rounded-br-sm px-4 py-2.5 text-xs font-bold max-w-[80%] shadow-md">
              ${msg.text}
            </div>
          </div>
        `;
      } else {
        return `
          <div class="flex items-start gap-2.5">
            <div class="w-7 h-7 rounded-2xl bg-tropical-teal/20 border border-tropical-teal/40 flex items-center justify-center text-tropical-teal text-xs flex-shrink-0 mt-0.5 shadow-md">
              <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
            </div>
            <div class="space-y-2 max-w-[85%]">
              <div class="bg-ocean-dark/90 border border-white/10 rounded-2xl rounded-tl-sm p-3.5 text-xs text-cloud-text leading-relaxed shadow-lg">
                ${msg.text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-tropical-teal font-bold">$1</strong>')}
              </div>

              ${msg.action ? `
                <button onclick="window.WanderAIAssistant.executeMessageAction(${idx})" class="w-full py-2 px-3 rounded-xl bg-tropical-teal/15 hover:bg-tropical-teal/25 border border-tropical-teal/40 text-tropical-teal text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md">
                  <span>${msg.action.btnText}</span>
                  <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                </button>
              ` : ''}
            </div>
          </div>
        `;
      }
    }).join('');

    if (window.lucide) window.lucide.createIcons();
    container.scrollTop = container.scrollHeight;
  }

  executeMessageAction(msgIdx) {
    const msg = this.messages[msgIdx];
    if (msg && msg.action && typeof msg.action.callback === 'function') {
      msg.action.callback();
      window.WanderApp.showToast('⚡ AI Action Executed!', 'success');
      this.toggleDrawer(false);
    }
  }
}

// Instantiate globally
document.addEventListener('DOMContentLoaded', () => {
  window.WanderAIAssistant = new WanderAIAssistant();
});
