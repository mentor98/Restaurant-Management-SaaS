# SavoryOS - Modern Restaurant Management & POS SaaS Platform

SavoryOS is an enterprise-grade, full-stack restaurant management platform engineered for multi-location restaurants, high-volume dining rooms, and cloud kitchens. Built with React 19, TypeScript, Tailwind CSS, Express, and Google Gemini AI, it unifies front-of-house POS, back-of-house Kitchen Display Systems (KDS), floor planning, inventory depletion, table reservations, customer CRM, and real-time revenue analytics into a single responsive application.

---

## 🌟 Key Features

### 1. High-Performance Point of Sale (POS)
- **Fast Touch Interface**: Search and filter dishes by dietary tags (Gluten-Free, Vegan, Halal, Chef Special) and categories.
- **Customizable Modifiers**: Modifiers with required choices, multi-select addons, and kitchen allergy notes.
- **Dine-In, Takeout & Delivery**: Instant table assignment or off-premise ticketing.
- **Split-Bill & Tip Calculator**: Equal split bill calculator with tip presets (15%, 18%, 20%, 25%) and custom amounts.
- **Thermal Receipt Printing**: Printable 80mm thermal receipt format with custom branding, itemized modifiers, tax breakdown, and barcodes.

### 2. Kitchen Display System (KDS)
- **Station-Specific Filtering**: Separate queues for Grill, Saute, Pizza, Fryer, Pantry, Bar, and Dessert.
- **Live Elapsed Timers & Urgency**: Visual color-coded ticket timers (Green `<12m`, Amber `12-20m`, Red `>20m`).
- **One-Click Bump Bar**: Advance tickets from *Prepping* to *Ready* to *Served*.
- **All-Day Prep Summary**: Live consolidated view of total ingredient counts needed across all active tickets.

### 3. Floor Plan & Table Management
- **Visual Zones**: Main Dining, Patio & Garden, Bar Area, Rooftop Lounge, and VIP Private Rooms.
- **Live Table Statuses**: Real-time color indicators for *Available*, *Occupied*, *Billing*, *Needs Cleaning*, and *Reserved*.
- **Direct POS Linking**: Open a table directly from the floor plan to start or add to a bill.

### 4. Menu & Recipe Management + AI Copywriter
- **Recipe Cost Engineering**: Real-time profit margin and food cost percentage tracking.
- **86'd Availability Toggle**: Instantly mark ingredients or dishes as out of stock across all terminals.
- **Gemini AI Description Assistant**: Generate appetizing menu descriptions on demand.

### 5. Table Bookings & Customer CRM
- **Guest Reservation Engine**: Party size, date/time scheduling, and table assignments.
- **VIP CRM & Loyalty**: Track lifetime spend, visit counts, dietary allergies, and personal dining preferences.

### 6. Inventory & Auto-Depletion Stock
- **Stock Depletion**: Tracks raw materials with unit metrics (`kg`, `lb`, `oz`, `liter`, `bottle`).
- **Low Stock Alerts**: Visual notifications when stock drops below par levels.
- **One-Click Restocking**: Quick replenishment directly from the management console.

### 7. Executive Sales & Analytics Dashboard
- **Real-Time Financial Metrics**: Gross revenue, net sales, average ticket size, and table turn rates.
- **Interactive Visualizations**: Hourly sales curves, category revenue distribution donuts, and top-selling dishes.
- **CSV Data Export**: Download transaction and revenue reports.

### 8. Role-Based Access Control (RBAC) & PIN Login
- **Quick PIN Switching**: 4-digit keypad login for seamless multi-server terminal handoffs.
- **Granular Roles**: Administrator, General Manager, Head Chef, Line Cook, Server, Bartender, Hostess, and Cashier.

---

## 🏗️ Architecture

```
├── server.ts                  # Express REST API & Vite SPA middleware
├── server/
│   ├── db.ts                  # JSON-backed database persistence engine
│   └── test-runner.ts         # Automated test suite (API, calculations, RBAC)
├── src/
│   ├── main.tsx               # React application entry point
│   ├── App.tsx                # View router & modal layout
│   ├── types.ts               # Shared TypeScript domain models
│   ├── context/
│   │   └── AppContext.tsx     # Global state provider & REST synchronization
│   └── components/
│       ├── Navbar.tsx         # Responsive header & role switcher
│       ├── PinLoginModal.tsx  # 4-digit PIN authentication pad
│       ├── ReceiptModal.tsx   # 80mm thermal receipt generator
│       ├── pos/               # POS Terminal, Modifier Modal, Payment Modal
│       ├── kds/               # Kitchen Display System & All-Day Drawer
│       ├── tables/            # Visual Floor Plan & Add Table Modal
│       ├── menu/              # Menu Editor & AI Dish Generator
│       ├── reservations/      # Booking manager & Calendar
│       ├── customers/         # VIP CRM & Loyalty Directory
│       ├── inventory/         # Stock Levels & Reorder Engine
│       ├── analytics/         # Recharts Revenue Dashboard & CSV Export
│       └── settings/          # Multi-Branch Config & Test Runner
```

---

## 🚀 Installation & Local Setup

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### Steps
1. **Clone the repository**:
   ```bash
   git clone https://github.com/example/savoryos.git
   cd savoryos
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Access the app at `http://localhost:3000`.

---

## 🔑 Environment Variables

| Variable | Description | Default |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Google Gemini API Key for AI menu descriptions | *Optional* |
| `NODE_ENV` | Environment mode (`development` or `production`) | `development` |

---

## 🔌 API Endpoints Reference

### Restaurant & Branches
- `GET /api/profile` - Fetch restaurant business profile
- `PUT /api/profile` - Update profile settings (tax rate, currency, receipts)
- `GET /api/branches` - List all multi-location branches

### Menu & Categories
- `GET /api/categories` - List menu categories
- `GET /api/menu` - Fetch all dishes and recipe items
- `POST /api/menu` - Create a new menu dish
- `PUT /api/menu/:id` - Update dish details or stock status
- `DELETE /api/menu/:id` - Remove a menu item

### Orders & Payments
- `GET /api/orders` - Retrieve active and historical orders
- `POST /api/orders` - Submit new order to kitchen & POS
- `POST /api/orders/:id/pay` - Settle bill with payment method & tips

### Kitchen Display System
- `GET /api/kds/tickets` - List live prep tickets with timers
- `POST /api/kds/bump` - Advance ticket status (prepping -> ready -> served)

### Tables & Floor Plan
- `GET /api/tables` - Fetch floor plan tables
- `POST /api/tables` - Add a new dining table
- `PUT /api/tables/:id/status` - Update table occupancy status

### Reservations & CRM
- `GET /api/reservations` - List table bookings
- `POST /api/reservations` - Book a reservation
- `GET /api/customers` - Fetch VIP guest directory
- `POST /api/customers` - Register new customer profile

### Inventory & Analytics
- `GET /api/inventory` - View stock levels & low par alerts
- `POST /api/inventory/:id/stock` - Adjust inventory quantity
- `GET /api/analytics` - Fetch aggregated sales metrics & hourly trends

---

## 🧪 Automated Testing

SavoryOS includes a built-in automated test runner that validates calculation accuracy, inventory depletion, order lifecycles, and role-based permissions.

Run tests via terminal:
```bash
npm test
```

Or execute tests interactively from the **Settings -> Automated Quality & Regression Test Suite** UI panel.

---

## 🛡️ License & Contributing

Distributed under the **Apache-2.0** License. Contributions and pull requests are welcome.
