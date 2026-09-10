// Shared helpers used across the store. Safe to import from both
// Server Components and Client Components.

export const TYPE_META = {
  physical: {
    label: "Ships in 3 Days",
    short: "Physical",
    delivery:
      "Handmade & printed in-house. Orders ship within 3 days of payment.",
  },
  digital: {
    label: "Instant Download",
    short: "Digital",
    delivery:
      "Digital product — your download link unlocks instantly after payment.",
  },
  dropship: {
    label: "Ships in 7+ Days",
    short: "Dropship",
    delivery:
      "Ships directly from our supplier. Delivery takes 7+ business days.",
  },
};

// Demo admin PIN (client-side only). Change it with NEXT_PUBLIC_ADMIN_PIN.
// This is a demo guard — real auth comes with Supabase (see README).
export const DEMO_ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || "admin123";

// Philippine Peso: ₱2,600.00
export function formatPrice(n) {
  return `₱${Number(n || 0).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatSold(n) {
  if (n >= 1000) {
    const k = (n / 1000).toFixed(1).replace(/\.0$/, "");
    return `${k}k sold`;
  }
  return `${n} sold`;
}

export function formatDate(iso) {
  return new Date(iso).toLocaleString("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function formatCountdown(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = String(Math.floor(total / 3600)).padStart(2, "0");
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return { h, m, s };
}

// Product "badge" logic:
//   isNew   -> green "New" badge
//   has sale price -> orange "Sale" badge
export function productBadge(product) {
  if (product.isNew) return { label: "New", style: "bg-new" };
  if (product.originalPrice && product.originalPrice > product.price) {
    return { label: "Sale", style: "bg-sale" };
  }
  return null;
}

// Minimal inline-SVG placeholder: dark canvas, product-name monogram
// + label. No network requests, works offline. Swap for real photos via
// Supabase Storage later.
export function placeholderImage(product) {
  const words = (product.name || "Nexus Product").trim().split(/\s+/);
  const initials = words
    .slice(0, 2)
    .map((w) => (w[0] || "").toUpperCase())
    .join("");
  const label = words.slice(0, 3).join(" ");
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'><rect width='600' height='600' fill='#16202b'/><circle cx='300' cy='250' r='120' fill='#1e2a36'/><text x='300' y='287' font-family='Georgia, Arial, sans-serif' font-size='96' font-weight='bold' fill='#8a8f8d' text-anchor='middle'>${initials}</text><text x='300' y='460' font-family='Georgia, Arial, sans-serif' font-size='30' font-weight='bold' fill='#fcfcfd' text-anchor='middle'>${label}</text><text x='300' y='495' font-family='Arial, sans-serif' font-size='18' fill='#8a8f8d' text-anchor='middle'>Nexus Store</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

// Demo digital "download" — creates a placeholder text file. Real files ship
// from Supabase Storage in production (see README).
export function downloadDemoFile(order, item) {
  const content = [
    `NEXUS STORE — DEMO DOWNLOAD`,
    `Order: ${order.id}`,
    `Item: ${item.name}`,
    ``,
    `This is a placeholder file.`,
    `Connect Supabase Storage + Resend to deliver real digital products automatically.`,
  ].join("\n");
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${item.productId || "download"}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}