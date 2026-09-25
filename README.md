# Winsteel Engineering Works Pvt. Ltd.
> **"Forming The Future"**

A modern, responsive, high-performance corporate website and SaaS-grade administration panel for **Winsteel Engineering Works Pvt. Ltd.**, an industry pioneer in heavy steel fabrication, segmental launching gantries, movable scaffolding systems (MSS), and precision infrastructure mould systems.

---

## 🏗️ Architecture & Philosophy

The project is intentionally engineered with **zero heavy frontend frameworks** and **no external cloud databases** (e.g. Supabase, Firebase, MongoDB, PostgreSQL). It adheres strictly to:

- **HTML5 Semantic Standards**
- **Vanilla CSS3** (Modular design system, responsive tokens, hardware-accelerated animations)
- **Vanilla JavaScript (ES6+)**
- **JSON Data Architecture** (`database/db.json` and `data/winsteel.json`)
- **Deployable directly to Vercel** as a static application with zero build-step overhead

---

## 📁 Project Directory Structure

```text
winsteel-project/
│
├── admin/                           # SaaS Management Portal
│   ├── index.html                   # Admin demo authentication login
│   ├── dashboard.html               # Analytics & quick activity cards
│   ├── products.html                # Product directory & actions
│   ├── product-edit.html            # Add/Edit product form
│   ├── projects.html                # Project directory
│   ├── project-edit.html            # Add/Edit project form
│   ├── facilities.html              # Plant bays & machinery manager
│   ├── strengths.html               # Core capabilities manager
│   ├── categories.html              # Product & project category manager
│   ├── certificates.html            # ISO / EN certification manager
│   ├── clients.html                 # Client logos & sectors
│   ├── news.html                    # Corporate releases directory
│   ├── news-edit.html               # Add/Edit news article
│   ├── settings.html                # Corporate coordinates & SEO settings
│   │
│   ├── css/
│   │   └── admin.css                # SaaS dashboard stylesheet
│   │
│   └── js/
│       ├── admin.js                 # Session auth, toast, and JSON exporter
│       ├── dashboard.js             # Dashboard metrics calculations
│       ├── products.js              # Products CRUD controller
│       ├── projects.js              # Projects CRUD controller
│       ├── facilities.js            # Facilities controller
│       ├── news.js                  # News controller
│       └── settings.js              # Settings manager
│
├── css/                             # Public Stylesheets
│   ├── style.css                    # Design tokens, typography & layouts
│   ├── responsive.css               # Media query breakpoints (1920px - 375px)
│   ├── animations.css               # Reveals, micro-interactions, keyframes
│   └── components.css               # Cards, buttons, modals, timelines
│
├── js/                              # Public JavaScript
│   ├── main.js                      # Header scroll, mobile drawer, quote forms
│   ├── data.js                      # Centralized async data loader
│   ├── products.js                  # Product catalog & dynamic details (ID)
│   ├── projects.js                  # Project portfolio & case study (ID)
│   ├── news.js                      # News directory & article views (ID)
│   ├── filters.js                   # Reusable category filter pill engine
│   ├── slider.js                    # Zero-dependency testimonial & gallery slider
│   └── animations.js                # IntersectionObserver scroll reveals & counters
│
├── data/
│   └── winsteel.json                # Production distribution data file
│
├── database/
│   └── db.json                      # Primary canonical database file
│
├── uploads/                         # Asset upload folders
│   ├── products/
│   ├── projects/
│   ├── facilities/
│   ├── news/
│   ├── certificates/
│   ├── clients/
│   └── general/
│
├── scripts/
│   ├── build-data.js                # Node sync & formatting tool
│   └── validate-data.js             # Data integrity & schema validator
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── logo/                        # Official Winsteel PNG & SVG vector logo
│
├── index.html                       # Home page
├── about.html                       # Company overview & capabilities
├── our-history.html                 # 35-year milestone timeline
├── core-values.html                 # Safety & quality principles
├── products.html                    # Equipment catalog & category filters
├── product-details.html             # Product spec matrix & dynamic loader (?id=...)
├── projects.html                    # Landmark projects portfolio
├── project-details.html             # Project case study (?id=...)
├── facilities.html                  # 200,000+ sq. ft. manufacturing bays
├── strengths.html                   # Why Winsteel / Testing & NDT
├── certificates.html                # ISO 9001, ISO 3834-2, EN 1090-2 showcase
├── news.html                        # Press & media releases
├── news-details.html                # News article viewer (?id=...)
├── clients.html                     # Tier-1 EPC client directory
├── contact.html                     # Contact inquiry & technical bid form
│
├── package.json
├── .gitignore
├── robots.txt
├── sitemap.xml
└── README.md
```

---

## 🚀 Running Locally

1. **Clone or navigate to the directory**:
   ```bash
   cd d:/Mansi/Peb
   ```

2. **Serve with any local HTTP server**:
   Since the website uses modern `fetch()` to read JSON data files asynchronously, it requires an HTTP/HTTPS context (not `file://`):
   ```bash
   # Using npx serve (recommended)
   npx serve -l 3000 .
   
   # Or using Python 3
   python -m http.server 3000
   ```

3. Open your browser at `http://localhost:3000`.

---

## 📊 How JSON Data Works

- **Primary Source**: `database/db.json` contains all structured content:
  - `categories` (Products & Projects taxonomy)
  - `products` (Technical specifications, capacities, steel grades, dimensions, gallery)
  - `projects` (Client, location, year, scope of work, materials, cover)
  - `facilities` (Plant area, tandem lifting crane limits, CNC machinery)
  - `strengths` (Engineering pillars, icons, descriptions)
  - `certificates` (Audit body, certificate number, validity, document reference)
  - `clients` (Corporation name, category, website)
  - `news` (Headline, author, date, body, category)
  - `settings` (Contact numbers, factory address, social media, SEO meta tags)

- **Centralized Data Loader** (`js/data.js`):
  All client-side rendering functions call `WinsteelData.getProducts()`, `WinsteelData.getProductById(id)`, etc. The data is cached in memory.

---

## 🔐 Admin Panel & Static Architecture

### Accessing the Admin Panel
- **URL**: `/admin/index.html`
- **Demo Credentials**:
  - **Username**: `admin`
  - **Password**: `winsteel2026`

### ⚠️ IMPORTANT: Static Admin Limitation & How Updates Work
Because this website intentionally does **not** rely on a backend server or external database:
1. **Frontend-Only Authentication**: The login mechanism is a demo session simulator. It is **not** a secure authentication backend.
2. **In-Browser Working Storage**: When you add, edit, or delete items inside `/admin/`, modifications are committed to the browser's `localStorage` (`winsteel_db_data`). This lets you immediately test changes across the public website locally in real time.
3. **Exporting Updated JSON (Persistence)**:
   - Click the **"Export db.json"** button located in the top bar of every admin page.
   - This downloads your modified database as `db.json`.
   - Replace `database/db.json` with the newly exported file.
   - Run the local build script:
     ```bash
     npm run build:data
     ```
   - Commit the updated `database/db.json` and `data/winsteel.json` to your repository and push to Vercel.

---

## 🛠️ Data Validation & Build Scripts

- **Validate Schema & ID Uniqueness**:
  ```bash
  npm run validate
  # or: node scripts/validate-data.js
  ```
- **Sync `database/db.json` to `data/winsteel.json`**:
  ```bash
  npm run build:data
  # or: node scripts/build-data.js
  ```

---

## ☁️ Deploying to Vercel

1. Push this repository to GitHub or GitLab.
2. Open [Vercel Dashboard](https://vercel.com/) and click **"Add New Project"**.
3. Import your repository.
4. **Build & Development Settings**:
   - Framework Preset: **Other**
   - Root Directory: `./`
   - Build Command: `node scripts/build-data.js` (Optional, or leave empty)
   - Output Directory: `./` (leave empty for root static delivery)
5. Click **Deploy**. Your Winsteel site will be live globally on Vercel's edge network!

---

## 📸 Replacing Images & Adding Content

### 1. Replacing Images
- Save new image files into the appropriate folder under `uploads/` (e.g. `uploads/products/` or `uploads/projects/`).
- Use relative paths like `uploads/products/my-new-gantry.jpg` or use public CDN URLs.

### 2. Adding Products or Projects
- Go to `/admin/products.html` and click **"+ Add Product"** (or `/admin/product-edit.html`).
- Fill in:
  - Unique ID (e.g., `prod-10`)
  - Title & URL Slug
  - Category from the dropdown
  - Short description and detailed overview
  - Features (one per line)
  - Specifications matrix (valid JSON key-values)
  - Cover image URL
- Save the product and export your updated JSON.

---

## 🎨 Official Brand Identity & Colors

- **Primary Blue**: `#0067B1` (Main brand color, buttons, active borders)
- **Dark Blue**: `#004B87` (Deep headings, corporate accents)
- **Industrial Yellow**: `#FFC400` (Tagline badge, highlighting accents)
- **Dark Navy**: `#071522` (Industrial header, blueprint backdrops, footer)
- **Light Grey**: `#F5F7FA` (Card backgrounds, spec tables)
- **Pure White**: `#FFFFFF` (Surface contrast)

---

## 📄 License & Attribution

© 2026 **Winsteel Engineering Works Pvt. Ltd.** All Rights Reserved.  
*Tagline: "Forming The Future"*
