import { ItemCategory } from '../types';

// Helper to encode SVG into Data URI
function encodeSvgDataUri(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
}

// Highly reliable, verified Unsplash images per specific item
export const PRODUCT_IMAGES = {
  // CS Textbooks & Academic Books
  clrsAlgorithms: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd8?w=800&auto=format&fit=crop&q=80',
  clrsAlgorithmsAlt: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=80',
  osConceptsBook: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
  calculusBook: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
  generalTextbook: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',

  // IT & Dev Hardware
  raspberryPiKit: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
  rtx3070Gpu: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&auto=format&fit=crop&q=80',
  keychronKeyboard: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
  unifiSwitch: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80',
  arduinoRoboticsKit: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=800&auto=format&fit=crop&q=80',
  dell4kMonitor: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
  nasDrives: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80',
  macbookPro: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
  ipadAir: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80',
  sonyHeadphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
  canonCamera: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
  monsteraPlant: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&auto=format&fit=crop&q=80',
  northfaceBackpack: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
  electricSkate: 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=800&auto=format&fit=crop&q=80',
  guitar: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&auto=format&fit=crop&q=80',
  deskLamp: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=800&auto=format&fit=crop&q=80',

  // Cyberpunk items
  cyberQuantum: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80',
  cyberHabitat: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
  cyberDrives: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
  cyberDrone: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=80',
};

// Beautiful custom illustrated SVG covers for product fallbacks (including CLRS book cover)
export const SVG_PRODUCT_COVERS: Record<string, string> = {
  clrs: encodeSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
      <defs>
        <linearGradient id="clrsBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f172a" />
          <stop offset="50%" stop-color="#1e293b" />
          <stop offset="100%" stop-color="#0f766e" />
        </linearGradient>
        <linearGradient id="bookCover" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0284c7" />
          <stop offset="100%" stop-color="#0369a1" />
        </linearGradient>
      </defs>
      <rect width="600" height="450" fill="url(#clrsBg)" />
      <!-- Book spine & cover -->
      <g transform="translate(160, 45)">
        <rect x="0" y="0" width="280" height="360" rx="14" fill="#0f172a" stroke="#38bdf8" stroke-width="3" opacity="0.9" />
        <rect x="15" y="15" width="250" height="330" rx="10" fill="url(#bookCover)" />
        <!-- CLRS Tree Graphic -->
        <g stroke="#ffffff" stroke-width="2.5" fill="none" opacity="0.85">
          <circle cx="140" cy="190" r="14" fill="#38bdf8" stroke="#ffffff" />
          <circle cx="95" cy="245" r="12" fill="#0284c7" stroke="#ffffff" />
          <circle cx="185" cy="245" r="12" fill="#0284c7" stroke="#ffffff" />
          <circle cx="70" cy="295" r="10" fill="#0f766e" stroke="#ffffff" />
          <circle cx="120" cy="295" r="10" fill="#0f766e" stroke="#ffffff" />
          <circle cx="160" cy="295" r="10" fill="#0f766e" stroke="#ffffff" />
          <circle cx="210" cy="295" r="10" fill="#0f766e" stroke="#ffffff" />
          <!-- Edges -->
          <line x1="140" y1="204" x2="95" y2="233" />
          <line x1="140" y1="204" x2="185" y2="233" />
          <line x1="95" y1="257" x2="70" y2="285" />
          <line x1="95" y1="257" x2="120" y2="285" />
          <line x1="185" y1="257" x2="160" y2="285" />
          <line x1="185" y1="257" x2="210" y2="285" />
        </g>
        <!-- Book Title Typography -->
        <text x="140" y="65" text-anchor="middle" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="16" letter-spacing="1">INTRODUCTION TO</text>
        <text x="140" y="95" text-anchor="middle" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="22" letter-spacing="1.5">ALGORITHMS</text>
        <text x="140" y="120" text-anchor="middle" fill="#bae6fd" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" letter-spacing="2">FOURTH EDITION</text>
        <!-- Authors -->
        <text x="140" y="325" text-anchor="middle" fill="#e0f2fe" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="9.5" letter-spacing="0.5">Cormen • Leiserson • Rivest • Stein</text>
      </g>
    </svg>
  `),
  
  osConcepts: encodeSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
      <rect width="600" height="450" fill="#0f172a" />
      <g transform="translate(160, 45)">
        <rect x="0" y="0" width="280" height="360" rx="14" fill="#065f46" stroke="#34d399" stroke-width="3" />
        <rect x="15" y="15" width="250" height="330" rx="10" fill="#047857" />
        <text x="140" y="65" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="16">OPERATING SYSTEM</text>
        <text x="140" y="95" text-anchor="middle" fill="#a7f3d0" font-family="system-ui, sans-serif" font-weight="900" font-size="22">CONCEPTS</text>
        <text x="140" y="120" text-anchor="middle" fill="#d1fae5" font-family="system-ui, sans-serif" font-weight="600" font-size="11">TENTH EDITION</text>
        <!-- CPU / Memory graphic -->
        <rect x="75" y="160" width="130" height="110" rx="8" fill="#064e3b" stroke="#34d399" stroke-width="2" />
        <text x="140" y="210" text-anchor="middle" fill="#34d399" font-family="monospace" font-weight="bold" font-size="14">KERNEL / MMU</text>
        <text x="140" y="235" text-anchor="middle" fill="#a7f3d0" font-family="monospace" font-size="11">0x7FFF0000</text>
        <text x="140" y="325" text-anchor="middle" fill="#ecfdf5" font-family="system-ui, sans-serif" font-size="10">Silberschatz • Galvin • Gagne</text>
      </g>
    </svg>
  `),
};

// Generic Category Fallback Images (high quality SVG graphics)
export const CATEGORY_FALLBACK_IMAGES: Record<ItemCategory, string> = {
  'All Categories': SVG_PRODUCT_COVERS.clrs,
  'CS Textbooks': SVG_PRODUCT_COVERS.clrs,
  'IT & Dev Hardware': encodeSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
      <rect width="600" height="450" fill="#090d16" />
      <g stroke="#10b981" stroke-width="2" fill="none" opacity="0.3">
        <path d="M0,50 H600 M0,100 H600 M0,150 H600 M0,200 H600 M0,250 H600 M0,300 H600 M0,350 H600 M0,400 H600" />
        <path d="M50,0 V450 M100,0 V450 M150,0 V450 M200,0 V450 M250,0 V450 M300,0 V450 M350,0 V450 M400,0 V450 M450,0 V450 M500,0 V450 M550,0 V450" />
      </g>
      <!-- Hardware Chip Centerpiece -->
      <g transform="translate(200, 125)">
        <rect x="0" y="0" width="200" height="200" rx="20" fill="#111827" stroke="#10b981" stroke-width="4" />
        <rect x="25" y="25" width="150" height="150" rx="12" fill="#064e3b" stroke="#34d399" stroke-width="2" />
        <!-- Pins -->
        <g stroke="#34d399" stroke-width="3">
          <line x1="50" y1="0" x2="50" y2="-15" />
          <line x1="100" y1="0" x2="100" y2="-15" />
          <line x1="150" y1="0" x2="150" y2="-15" />
          <line x1="50" y1="200" x2="50" y2="215" />
          <line x1="100" y1="200" x2="100" y2="215" />
          <line x1="150" y1="200" x2="150" y2="215" />
          <line x1="0" y1="50" x2="-15" y2="50" />
          <line x1="0" y1="100" x2="-15" y2="100" />
          <line x1="0" y1="150" x2="-15" y2="150" />
          <line x1="200" y1="50" x2="215" y2="50" />
          <line x1="200" y1="100" x2="215" y2="100" />
          <line x1="200" y1="150" x2="215" y2="150" />
        </g>
        <text x="100" y="95" text-anchor="middle" fill="#6ee7b7" font-family="monospace" font-weight="bold" font-size="16">DEV / HARDWARE</text>
        <text x="100" y="125" text-anchor="middle" fill="#a7f3d0" font-family="monospace" font-size="12">IT &amp; ROBOTICS</text>
      </g>
    </svg>
  `),
  'Electronics': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
  'Textbooks': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
  'Cameras': 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
  'Furniture': 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=800&auto=format&fit=crop&q=80',
  'Plants & Home': 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&auto=format&fit=crop&q=80',
  'Bags & Apparel': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
  'Instruments': 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&auto=format&fit=crop&q=80',
};

/**
 * Returns a guaranteed fallback image URL based on title and category.
 */
export function getProductFallbackImage(title?: string, category?: ItemCategory): string {
  const lowerTitle = (title || '').toLowerCase();

  if (lowerTitle.includes('algorithm') || lowerTitle.includes('clrs')) {
    return SVG_PRODUCT_COVERS.clrs;
  }
  if (lowerTitle.includes('operating system') || lowerTitle.includes('dinosaur')) {
    return SVG_PRODUCT_COVERS.osConcepts;
  }
  if (lowerTitle.includes('raspberry') || lowerTitle.includes('pi') || lowerTitle.includes('arduino')) {
    return PRODUCT_IMAGES.raspberryPiKit;
  }
  if (lowerTitle.includes('keyboard') || lowerTitle.includes('keychron')) {
    return PRODUCT_IMAGES.keychronKeyboard;
  }
  if (lowerTitle.includes('rtx') || lowerTitle.includes('gpu') || lowerTitle.includes('geforce')) {
    return PRODUCT_IMAGES.rtx3070Gpu;
  }
  if (lowerTitle.includes('switch') || lowerTitle.includes('unifi') || lowerTitle.includes('network')) {
    return PRODUCT_IMAGES.unifiSwitch;
  }
  if (lowerTitle.includes('monitor') || lowerTitle.includes('ultrasharp') || lowerTitle.includes('dell')) {
    return PRODUCT_IMAGES.dell4kMonitor;
  }
  if (lowerTitle.includes('macbook') || lowerTitle.includes('laptop')) {
    return PRODUCT_IMAGES.macbookPro;
  }
  if (lowerTitle.includes('calculus') || lowerTitle.includes('math')) {
    return PRODUCT_IMAGES.calculusBook;
  }
  if (lowerTitle.includes('headphone') || lowerTitle.includes('sony') || lowerTitle.includes('airpod')) {
    return PRODUCT_IMAGES.sonyHeadphones;
  }
  if (lowerTitle.includes('camera') || lowerTitle.includes('canon')) {
    return PRODUCT_IMAGES.canonCamera;
  }
  if (lowerTitle.includes('plant') || lowerTitle.includes('monstera')) {
    return PRODUCT_IMAGES.monsteraPlant;
  }
  if (lowerTitle.includes('backpack') || lowerTitle.includes('bag')) {
    return PRODUCT_IMAGES.northfaceBackpack;
  }

  if (category && CATEGORY_FALLBACK_IMAGES[category]) {
    return CATEGORY_FALLBACK_IMAGES[category];
  }

  return CATEGORY_FALLBACK_IMAGES['IT & Dev Hardware'];
}
