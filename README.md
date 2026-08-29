# WanderAI 🌍✨
> **"Travel beyond the tourist map."**
> AI-powered trips, smarter bookings, and hidden places you’ll actually remember.

---

## 🚀 Startup Positioning
**WanderAI** is positioned as:
> *"Google Maps + Booking.com + ChatGPT for travelers who want experiences beyond tourist attractions."*

By combining real-time crowd density analysis, AI itinerary synthesis, and a 7-category travel booking engine, WanderAI helps travelers bypass tourist traps, save money, and discover serene secret spots around the globe.

---

## 🌟 Core Features

### 1. 🤖 AI Trip Planner & Day-by-Day Timeline
- **Intelligent Parameterization**: Destination, travel dates/duration, number of travelers, budget slider with real-time currency conversion (₹ INR, $ USD, € EUR, £ GBP, ¥ JPY), travel style, and interest tags.
- **Dynamic Morning/Afternoon/Evening/Night Timeline**: Displays transit times, estimated costs, crowd percentages, and "Why AI Recommends This" reasoning.
- **Interactive Controls**:
  - 🔄 **Regenerate / Swap**: Switch any activity slot with alternative suggestions.
  - 🛡️ **Escape the Crowd**: Automatically replace any crowded tourist hotspot with a tranquil hidden gem nearby.
  - ➕ **Add Activity / Dining**: Insert custom stops directly into any day.
  - ⚡ **AI Optimizers**: Minimize transit distances, apply budget savings (~25%), or switch to Maximum Serenity Mode.
- **Export & Sync**: PDF export, `.ics` iCalendar download, and smart shareable URL generator.

### 2. 🏨 Multi-Category Travel Booking Engine
- **7 Booking Categories**:
  1. **Hotels & Stays**: Boutique villas, heritage havelis, ryokans, eco-resorts, cave suites.
  2. **Flights**: Direct/layover flights with carbon offset metrics and baggage allowances.
  3. **Scenic Trains**: Panoramic glass-dome alpine trains, Japanese Shinkansen, Vande Bharat Express.
  4. **Buses & Shuttles**: Luxury sleeper pods, hop-on coastal shuttles.
  5. **Car Rentals**: Tesla electric AWDs, Land Rover 4x4 Defenders, vintage convertibles.
  6. **Activities & Tours**: Private tea ceremonies, sunrise volcano hikes, bioluminescent kayaking.
  7. **Dining & Cafes**: Hidden courtyard bistros, cliff-edge sunset tables.
- **Simulated Checkout & Pass Generation**:
  - Live price calculation with taxes and carbon offset.
  - Generates instant verified digital E-Tickets and Boarding Passes with scannable QR codes and Reference IDs.
  - **"Sync to Itinerary"** button inserts booked items directly into the user's active travel schedule!

### 3. 🌿 Hidden Gems Discovery & "Escape the Crowd™" Engine
- **Curated Secret Spots**: Comprehensive directory of underrated locations with crowd scores (0-100%), uniqueness ratings, insider tips, best arrival windows, and estimated costs.
- **"Escape the Crowd" Side-by-Side Comparison Arena**:
  - Compares famous tourist hotspots (e.g. *Taj Mahal, Fushimi Inari, Positano, Colosseum, Canggu*) against tranquil alternatives (e.g. *Mehtab Bagh, Otagi Nenbutsu-ji, Fiordo di Furore, Appian Way, Sidemen Terraces*).
  - Highlights crowd density reduction (up to 90% fewer tourists) and offers 1-click replacement into the user's active trip.

### 4. 🗺️ Synchronized Interactive Map (Leaflet.js)
- Responsive dark/light theme cartography tiles.
- Layer toggles for Hidden Gems, Hotels, and Dining.
- Animated polyline routes connecting itinerary stops with markers and quick-action preview popups.

### 5. 💬 Conversational AI Travel Assistant ("WanderAI Copilot")
- Accessible anywhere via floating trigger button.
- Context-aware chatbot that understands user constraints and **directly executes live actions**:
  - *"Make my itinerary cheaper"* ➔ Reduces costs across days.
  - *"Escape the crowds at Kyoto"* ➔ Replaces crowded spots with serene gems.
  - *"Find hidden places near Goa"* ➔ Plans a custom offbeat beach itinerary.

### 6. 📊 User Dashboard ("My WanderHub") & Travel Budget Tracker
- **Travel Persona & Gamified Metrics**: Crowds avoided %, saved secret spots, confirmed passes, and money saved via AI.
- **Live Travel Budget Tracker**: Visual progress bar comparing target budget against booked reservations and planned day expenses.
- **Digital Pass Wallet**: Access all confirmed booking vouchers with QR codes.

---

## 🛠️ Technology Stack
- **Frontend**: Modern HTML5, Tailwind CSS, Lucide Icons, Leaflet.js
- **State Management**: Reactive Vanilla JavaScript modules with `localStorage` persistence
- **Audio Engine**: Web Audio API synthesized chimes for interactive feedback
- **Architecture**: Zero external backend runtime required to test/run; ready for REST / GraphQL API integration

---

## 🏃 Running the Application

### Option 1: Double Click / Direct Open
Simply double-click `index.html` or open it with Google Chrome, Microsoft Edge, or Firefox.

### Option 2: Local HTTP Server (PowerShell)
Run the included PowerShell script to serve locally:
```powershell
.\serve.ps1
```
Open [http://localhost:5173](http://localhost:5173) in your browser.
