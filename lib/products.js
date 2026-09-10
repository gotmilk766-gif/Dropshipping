// Demo product catalog. In production this comes from Supabase —
// the schema and a swap guide are in README.md.

export const CATEGORIES = [
  { id: "3d-prints", label: "3D Prints" },
  { id: "digital", label: "Digital" },
  { id: "dropship", label: "Dropship" },
  { id: "customs", label: "Customs" },
  { id: "toys", label: "Toys" },
];

export const PRODUCT_TYPES = [
  { id: "physical", label: "Physical — 3D Print (ships in 3 days)" },
  { id: "digital", label: "Digital — Instant Download" },
  { id: "dropship", label: "Dropship — Supplier (ships in 7+ days)" },
];

export const DEMO_PRODUCTS = [
  {
    id: "articulated-dragon-toy",
    name: "Articulated Dragon Toy (Flexi)",
    type: "physical",
    category: "3d-prints",
    price: 500,
    originalPrice: 650,
    stock: 12,
    sold: 1247,
    rating: 4.9,
    flashSale: true,
    isNew: true,
    spotlight: true,
    description:
      "A fully articulated 3D-printed dragon with movable joints. Printed in PLA with smooth, sanded finish — a favorite for desk displays and gifts.",
    features: [
      "Print-in-place articulated joints — no assembly",
      "~18 cm long, lightweight PLA plastic",
      "Available in multiple filament colors",
      "Hand-finished and quality checked before shipping",
    ],
  },
  {
    id: "kds-restaurant-excel-template",
    name: "KDS Restaurant Operations Excel Template",
    type: "digital",
    category: "digital",
    price: 350,
    originalPrice: 499,
    stock: 9999,
    sold: 3214,
    rating: 4.8,
    flashSale: true,
    isNew: true,
    spotlight: true,
    description:
      "The complete KDS (Kitchen Display System) operations workbook: order tracking, prep times, waste logging and staff shift scheduling — all in one Excel file with formulas and dashboards built in.",
    features: [
      "Order & prep-time tracker with auto dashboards",
      "Inventory and waste log with cost calculations",
      "Staff shift scheduler with overtime flagging",
      "Works with Excel 2016+, Office 365 & Google Sheets",
    ],
  },
  {
    id: "wireless-earbuds-pro",
    name: "Wireless Earbuds Pro (Dropship)",
    type: "dropship",
    category: "dropship",
    price: 650,
    originalPrice: 999,
    stock: 15,
    sold: 432,
    rating: 4.6,
    flashSale: true,
    description:
      "True wireless earbuds with touch controls, deep bass and a charging case that lasts 24+ hours. Ships directly from our supplier.",
    features: [
      "Bluetooth 5.3, auto-pair on open",
      "24h total battery with charging case",
      "Touch controls for calls & music",
      "IPX4 splash resistant",
    ],
  },
  {
    id: "anime-figure-replica",
    name: "Anime Figure Replica (PVC, 20cm)",
    type: "dropship",
    category: "toys",
    price: 890,
    originalPrice: 1200,
    stock: 8,
    sold: 210,
    rating: 4.7,
    flashSale: true,
    description:
      "High-detail 20cm PVC figure replica. Ships from our overseas supplier — expect 7+ business days delivery.",
    features: [
      "20cm tall, high-detail PVC",
      "Collector box included",
      "Pre-orders restock weekly",
      "Ships from supplier warehouse",
    ],
  },
  {
    id: "custom-name-keychain",
    name: "Custom Name Keychain (Your Text)",
    type: "physical",
    category: "customs",
    price: 150,
    stock: 40,
    sold: 532,
    rating: 4.9,
    description:
      "3D-printed keychain with your name, tagline or handle in bold letters. Add your text in the order notes.",
    features: [
      "Any text up to 12 characters",
      "Choose from 10 filament colors",
      "~7 cm wide, keyring included",
      "Printed to order in 1–2 days",
    ],
  },
  {
    id: "kds-inventory-tracker",
    name: "KDS Inventory Tracker Excel Template",
    type: "digital",
    category: "digital",
    price: 280,
    stock: 9999,
    sold: 1507,
    rating: 4.7,
    description:
      "Track stock levels, reorder points and supplier prices across your kitchen or store. Alerts highlight items that need reordering.",
    features: [
      "Live low-stock alerts",
      "Multi-supplier price comparison",
      "Monthly usage & waste reports",
      "Macro-free, safe for shared drives",
    ],
  },
  {
    id: "flexi-phone-stand",
    name: "Flexi Phone Stand (Desk)",
    type: "physical",
    category: "3d-prints",
    price: 220,
    stock: 25,
    sold: 890,
    rating: 4.8,
    description:
      "Adjustable 3D-printed phone stand for desks, nightstands and kitchen counters. Holds phones up to 8.5\" in any angle.",
    features: [
      "Adjustable viewing angle",
      "Cable management slot",
      "Non-slip base pads",
      "Rigid PETG print",
    ],
  },
  {
    id: "smartwatch-strap",
    name: "Silicone Smartwatch Strap (All Sizes)",
    type: "dropship",
    category: "dropship",
    price: 320,
    stock: 30,
    sold: 671,
    rating: 4.5,
    description:
      "Soft silicone strap compatible with 38/40/41/42/44/45/49mm smartwatches. Ships from supplier in 7+ days.",
    features: [
      "Sweat-proof soft silicone",
      "6 colors available",
      "Quick-release pins included",
      "Universal lug fit",
    ],
  },
  {
    id: "social-media-calendar-excel",
    name: "Social Media Content Calendar (Excel)",
    type: "digital",
    category: "digital",
    price: 190,
    stock: 9999,
    sold: 986,
    rating: 4.6,
    description:
      "Plan a month of posts across TikTok, Facebook and Instagram with drag-and-drop scheduling, caption library and hashtag bank.",
    features: [
      "Monthly + weekly planning views",
      "Caption & hashtag library",
      "Content pillar tracker",
      "Google Sheets compatible",
    ],
  },
  {
    id: "mini-plant-pot",
    name: "Desktop Mini Plant Pot (Printed)",
    type: "physical",
    category: "toys",
    price: 180,
    stock: 34,
    sold: 322,
    rating: 4.7,
    description:
      "Cute 3D-printed planter for succulents and small plants. Drainage hole included, 8cm diameter.",
    features: [
      "8 cm diameter, 6 cm tall",
      "Drainage hole + tray",
      "Sanded smooth finish",
      "Printed to order in 1–2 days",
    ],
  },
  {
    id: "invoice-receipt-template",
    name: "Invoice & Receipt Excel Template (PH)",
    type: "digital",
    category: "digital",
    price: 240,
    stock: 9999,
    sold: 763,
    rating: 4.8,
    description:
      "Professional invoices and receipts with BIR-friendly formatting, auto totals, VAT toggle and PDF print layouts.",
    features: [
      "Auto invoice numbering",
      "VAT / non-VAT toggle",
      "Printable A4 layouts",
      "Customer & item databases",
    ],
  },
  {
    id: "led-gaming-mouse",
    name: "RGB LED Gaming Mouse (Dropship)",
    type: "dropship",
    category: "dropship",
    price: 450,
    stock: 20,
    sold: 518,
    rating: 4.4,
    description:
      "Ergonomic gaming mouse with RGB lighting, 6 programmable buttons and 2400 DPI sensor. Ships from supplier in 7+ days.",
    features: [
      "2400 DPI adjustable sensor",
      "6 programmable buttons",
      "16.8M RGB lighting",
      "Braided USB cable",
    ],
  },
];

export function getCategoryLabel(id) {
  return CATEGORIES.find((c) => c.id === id)?.label || id;
}

// Products added through the demo admin panel live in localStorage.
export function getLocalProducts() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem("nexus_demo_products") || "[]");
  } catch {
    return [];
  }
}

export function getProducts() {
  return [...DEMO_PRODUCTS, ...getLocalProducts()];
}

export function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}