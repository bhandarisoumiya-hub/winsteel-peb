const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// 1. Update Categories
db.categories.products = [
  "All",
  "Pre-Engineered Buildings (PEB)",
  "Industrial Sheds & Warehouses",
  "Multi-Storey Steel Buildings",
  "Formworks and Moulds",
  "Movable Scaffolding Systems",
  "Launching Gantries",
  "Tunnel Formworks",
  "Custom Made Moulds",
  "Residential and Commercial Projects",
  "Special Purpose Equipments"
];

db.categories.projects = [
  "All",
  "Industrial PEB Structures",
  "Highway Bridges",
  "Metro Rail",
  "Special Structures",
  "Marine & Ports"
];

// 2. Update Settings
db.settings.shortAbout = "Premier turnkey manufacturer of Pre-Engineered Steel Buildings (PEB), heavy industrial sheds, clear-span logistics warehouses, multi-storey steel complexes, and heavy infrastructure steel systems.";
db.settings.seo.defaultTitle = "Winsteel Engineering Works | Pre-Engineered Buildings (PEB) & Steel Structures";
db.settings.seo.defaultDescription = "Winsteel Engineering Works is an industry leader in Pre-Engineered Steel Buildings (PEB), industrial sheds, clear-span warehouses, multi-storey steel buildings, and heavy infrastructure engineering.";
db.settings.seo.defaultKeywords = "Winsteel, PEB, Pre-Engineered Buildings, industrial shed, steel warehouse, clear span steel building, structural steel fabrication, Navi Mumbai, Maharashtra";

// 3. New PEB Products
const pebProducts = [
  {
    "id": "prod-peb-1",
    "title": "Turnkey Pre-Engineered Steel Buildings (PEB)",
    "slug": "turnkey-pre-engineered-buildings",
    "category": "Pre-Engineered Buildings (PEB)",
    "shortDescription": "Complete design, 3D structural engineering, precision fabrication and rapid erection of custom Pre-Engineered Steel Buildings.",
    "description": "Winsteel Engineering Works is an industry-leading manufacturer of turnkey Pre-Engineered Buildings (PEB). We design, engineer, fabricate and erect state-of-the-art PEB structures for heavy manufacturing plants, logistics hubs, automotive complexes, and commercial facilities. Utilizing high-tensile steel (IS 2062 / ASTM A572 Grade 50), automated submerged arc welding, and precision CNC cold-formed C/Z purlins, our PEB structures provide up to 90m clear-span column-free space, 40% faster erection than conventional concrete, and superior seismic and wind resistance.",
    "image": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85",
    "gallery": [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=1200&q=85"
    ],
    "features": [
      "Clear span designs up to 90 meters without intermediate columns for maximum floor flexibility",
      "100% custom-engineered to site dimensions, wind speeds up to 200 km/h, and seismic zone requirements",
      "Manufactured with high-tensile IS 2062 E350/E450 steel with automated submerged arc welding (SAW)",
      "Integrated crane runway systems supporting 5T to 100T heavy-duty EOT cranes",
      "Energy-efficient insulated sandwich panel roofing, continuous ridge ventilators, and polycarbonate skylights"
    ],
    "specifications": {
      "Max Clear Span": "Up to 90 Meters (Zero internal columns)",
      "Steel Standards": "IS 2062 E350 / E450 & ASTM A572 Grade 50",
      "Secondary Framing": "Galvanized cold-formed Z & C purlins (275 GSM coating)",
      "Roofing System": "Standing Seam 360° double-lock leakproof Galvalume AZ150",
      "Design Compliance": "IS 800:2007, MBMA 2012, AISC 360, IS 875 (Part 3)",
      "Erection Speed": "Up to 40% faster turnaround compared to conventional RCC"
    },
    "status": "Active",
    "featured": true,
    "displayOrder": 1
  },
  {
    "id": "prod-peb-2",
    "title": "Clear-Span Industrial Sheds & Logistics Warehouses",
    "slug": "industrial-sheds-logistics-warehouses",
    "category": "Industrial Sheds & Warehouses",
    "shortDescription": "Heavy-duty industrial sheds, clear-span distribution centers, and high-bay logistics warehouses built for heavy operations.",
    "description": "Winsteel fabricates high-volume, clear-span industrial sheds and automated logistics warehouses engineered for maximum volumetric storage and seamless internal material flow. Designed to support heavy overhead EOT cranes, automated storage and retrieval systems (ASRS), mezzanine floors, and multi-bay dock levelers, our warehouses are built to withstand rigorous industrial operational cycles.",
    "image": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=85",
    "gallery": [
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85"
    ],
    "features": [
      "High-bay vertical clearances up to 18 meters for high-density multi-tier racking",
      "Heavy-duty EOT crane girder design from 10 MT to 80 MT capacity",
      "Continuous gravity ridge monitors and power turbo ventilators for natural air circulation",
      "Polycarbonate daylight skylight strips reducing daytime lighting costs by up to 60%",
      "Engineered dock-leveler pits and wide canopy projections for 24/7 all-weather logistics"
    ],
    "specifications": {
      "Bay Spacing": "6m to 9m standard (customizable up to 12m)",
      "Clear Height": "6m to 18m eave height",
      "Floor Area": "5,000 to 1,00,000+ sq. meters",
      "Crane Capacity": "Up to 80 MT crane runways",
      "Wall Cladding": "Color Coated Galvalume / PUF insulated sandwich panels",
      "Corrosion Protection": "Blast cleaned SA 2.5 + Epoxy primer + Polyurethane finish"
    },
    "status": "Active",
    "featured": true,
    "displayOrder": 2
  },
  {
    "id": "prod-peb-3",
    "title": "Multi-Storey Commercial & Industrial Steel Buildings",
    "slug": "multi-storey-steel-buildings",
    "category": "Multi-Storey Steel Buildings",
    "shortDescription": "Fast-track multi-level commercial complexes, IT parks, factory mezzanine structures, and heavy industrial towers.",
    "description": "Modern commercial and high-density industrial facilities demand rapid construction speed, large column-free interior floor plates, and flexible architectural aesthetics. Winsteel's multi-storey structural steel framing systems with composite metal deck slabs reduce foundation dead loads by 30% and compress construction schedules by half compared to conventional RCC.",
    "image": "https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=1200&q=85",
    "gallery": [
      "https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=85"
    ],
    "features": [
      "Composite steel beam and profiled metal decking slabs for lightened structural weight",
      "Up to 50% faster floor-by-floor cycle completion compared to conventional concrete frame",
      "Flexible column grids allowing adaptable open-plan commercial floor plates",
      "Factory-applied fireproof intumescent coating meeting 2-hour and 4-hour fire ratings",
      "Service penetrations pre-engineered into castellated beams for seamless HVAC routing"
    ],
    "specifications": {
      "Number of Storeys": "G+2 up to G+15 storeys",
      "Structural System": "Rigid Moment Resisting Frame / Braced Frame System",
      "Floor Deck": "Galvanized Profiled Metal Deck (1.0mm/1.2mm)",
      "Foundation Load": "~30% dead weight reduction vs reinforced concrete",
      "Design Standards": "IS 800:2007, AISC 341 (Seismic Design Manual)",
      "Fire Rating": "Up to 4-Hour intumescent coating compliance"
    },
    "status": "Active",
    "featured": true,
    "displayOrder": 3
  }
];

// Re-order existing products
const existingProducts = db.products.filter(p => !p.id.startsWith('prod-peb-')).map((p, idx) => ({
  ...p,
  featured: false,
  displayOrder: idx + 4
}));

db.products = [...pebProducts, ...existingProducts];

// 4. New PEB Projects
const pebProjects = [
  {
    "id": "proj-peb-1",
    "title": "65,000 Sq. Mtr. Automated PEB Logistics & Distribution Hub",
    "slug": "mega-peb-logistics-distribution-park",
    "category": "Industrial PEB Structures",
    "location": "Chakan Industrial Corridor, Pune, India",
    "year": "2024",
    "client": "National Logistics Parks Ltd / Global E-Commerce Major",
    "shortDescription": "Turnkey engineering, automated CNC fabrication, and high-speed erection of a 65,000 sq. mtr. clear-span Pre-Engineered steel warehouse.",
    "description": "Winsteel executed the complete turnkey Pre-Engineered Building (PEB) contract for one of Western India's largest automated fulfillment centers. Featuring 72-meter clear spans without intermediate columns, heavy 35-tonne mezzanine sorting floors, 48 automated dock-leveler bays, and standing-seam leakproof roofing with integrated skylights. The entire 4,800 MT structural steel superstructure was delivered and erected in record 5.5 months.",
    "coverImage": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85",
    "gallery": [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=85"
    ],
    "scopeOfWork": "Architectural concept planning, 3D TEKLA detailing, automated CNC H-beam line fabrication, PUF insulation cladding, and fast-track site erection.",
    "materials": "4,800 MT High-Yield E350/E450 Steel, 275 GSM Galvalume Roofing, High-Strength 10.9 Grade Bolts.",
    "status": "Completed",
    "featured": true,
    "displayOrder": 1
  },
  {
    "id": "proj-peb-2",
    "title": "Heavy Machinery Manufacturing PEB Plant with 50T Crane System",
    "slug": "heavy-machinery-peb-manufacturing-plant",
    "category": "Industrial PEB Structures",
    "location": "Sanand Industrial Estate, Gujarat, India",
    "year": "2024",
    "client": "Precision Auto-Components Pvt. Ltd.",
    "shortDescription": "38,000 sq. mtr. heavy manufacturing PEB shed with heavy crane gantries, insulated wall cladding, and turbo-ventilated roof monitors.",
    "description": "Designed for heavy automotive component forging and assembly, this PEB structure accommodates multi-tier overhead EOT cranes with capacities up to 50 Metric Tonnes operating simultaneously along 300-meter continuous bays. Winsteel's engineering team optimized the primary tapered portal frames to handle severe dynamic fatigue loads while saving 18% steel mass compared to conventional hot-rolled sections.",
    "coverImage": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=85",
    "gallery": [
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"
    ],
    "scopeOfWork": "Structural dynamic analysis, fabrication of built-up I-sections and crane runway beams, fireproof intumescent coating, turnkey erection.",
    "materials": "3,100 MT Built-up High-Tensile Steel, 0.55mm Bare Galvalume Standing Seam Sheets, Polycarbonate Daylighting Strips.",
    "status": "Completed",
    "featured": true,
    "displayOrder": 2
  }
];

const existingProjects = db.projects.filter(p => !p.id.startsWith('proj-peb-')).map((p, idx) => ({
  ...p,
  featured: idx === 0, // Keep project 1 (Mumbai Trans Harbour Link) as 3rd featured project
  displayOrder: idx + 3
}));

db.projects = [...pebProjects, ...existingProjects];

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Successfully updated database/db.json with PEB products and projects.');
