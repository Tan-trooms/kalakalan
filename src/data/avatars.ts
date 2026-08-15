/**
 * Collection of hand-drawn / illustrated character avatar drawings.
 * Uses crisp SVG vector illustrations (hand-drawn student characters with distinct hairstyles, expressions, accessories, and colors)
 * along with DiceBear Open-Peeps and Avataaars drawing collections.
 */

// Helper to create clean encoded SVG avatar drawings
export function createSvgAvatarDrawing(options: {
  bg: string;
  skin?: string;
  hair: string;
  hairStyle: 'messy' | 'curly' | 'short' | 'long' | 'bob' | 'beanie' | 'cap' | 'ponytail' | 'cyber';
  shirt: string;
  glasses?: boolean;
  blush?: boolean;
  mouth?: 'smile' | 'big-smile' | 'smirk' | 'open';
  eyes?: 'happy' | 'wink' | 'normal' | 'sparkle';
  accessory?: 'headphone' | 'earring' | 'visor';
}): string {
  const {
    bg = '#E0F2FE',
    skin = '#FBD38D',
    hair = '#2D3748',
    hairStyle = 'short',
    shirt = '#319795',
    glasses = false,
    blush = true,
    mouth = 'smile',
    eyes = 'happy',
    accessory,
  } = options;

  let hairSvg = '';
  switch (hairStyle) {
    case 'curly':
      hairSvg = `
        <circle cx="34" cy="36" r="14" fill="${hair}" />
        <circle cx="66" cy="36" r="14" fill="${hair}" />
        <circle cx="50" cy="26" r="16" fill="${hair}" />
        <circle cx="28" cy="48" r="11" fill="${hair}" />
        <circle cx="72" cy="48" r="11" fill="${hair}" />
      `;
      break;
    case 'messy':
      hairSvg = `
        <path d="M26,50 Q30,22 50,22 Q70,22 74,50 Q66,28 50,30 Q34,28 26,50 Z" fill="${hair}" />
        <path d="M40,24 Q48,14 58,22 Q52,18 40,24 Z" fill="${hair}" />
        <path d="M28,34 Q22,26 34,26 Z" fill="${hair}" />
        <path d="M72,34 Q78,26 66,26 Z" fill="${hair}" />
      `;
      break;
    case 'beanie':
      hairSvg = `
        <path d="M24,44 C24,20 76,20 76,44 Z" fill="${hair}" />
        <rect x="22" y="40" width="56" height="10" rx="4" fill="${hair}" stroke="#1E293B" stroke-width="1.5" />
        <circle cx="50" cy="20" r="5" fill="#E2E8F0" />
      `;
      break;
    case 'cap':
      hairSvg = `
        <path d="M26,42 C26,24 74,24 74,42 Z" fill="${hair}" />
        <path d="M22,42 Q50,38 78,42 Q86,45 88,48 Q50,46 18,48 Q20,44 22,42 Z" fill="${hair}" stroke="#0F172A" stroke-width="1" />
      `;
      break;
    case 'long':
      hairSvg = `
        <path d="M24,46 Q22,78 30,86 Q34,56 34,46 Z" fill="${hair}" />
        <path d="M76,46 Q78,78 70,86 Q66,56 66,46 Z" fill="${hair}" />
        <path d="M25,48 C25,22 75,22 75,48 Q60,32 50,32 Q38,32 25,48 Z" fill="${hair}" />
      `;
      break;
    case 'bob':
      hairSvg = `
        <path d="M24,42 C24,20 76,20 76,42 Q78,68 70,72 Q64,48 50,48 Q36,48 30,72 Q22,68 24,42 Z" fill="${hair}" />
      `;
      break;
    case 'ponytail':
      hairSvg = `
        <circle cx="74" cy="30" r="10" fill="${hair}" />
        <path d="M74,30 Q88,38 84,60 Q76,50 72,36 Z" fill="${hair}" />
        <path d="M26,46 C26,22 74,22 74,46 Q60,34 50,34 Q38,34 26,46 Z" fill="${hair}" />
      `;
      break;
    case 'cyber':
      hairSvg = `
        <path d="M24,46 L36,18 L52,26 L66,16 L76,46 Q60,34 50,34 Z" fill="${hair}" />
        <path d="M76,42 L84,52 L74,60 Z" fill="${hair}" />
      `;
      break;
    default: // short
      hairSvg = `
        <path d="M26,46 C26,22 74,22 74,46 Q62,32 50,32 Q38,32 26,46 Z" fill="${hair}" />
        <path d="M24,48 Q22,34 32,30 Z" fill="${hair}" />
        <path d="M76,48 Q78,34 68,30 Z" fill="${hair}" />
      `;
  }

  let eyesSvg = '';
  switch (eyes) {
    case 'wink':
      eyesSvg = `
        <circle cx="40" cy="50" r="3.5" fill="#1E293B" />
        <path d="M56,51 Q61,46 66,51" stroke="#1E293B" stroke-width="2.5" stroke-linecap="round" fill="none" />
      `;
      break;
    case 'happy':
      eyesSvg = `
        <path d="M34,51 Q40,45 46,51" stroke="#1E293B" stroke-width="2.5" stroke-linecap="round" fill="none" />
        <path d="M54,51 Q60,45 66,51" stroke="#1E293B" stroke-width="2.5" stroke-linecap="round" fill="none" />
      `;
      break;
    case 'sparkle':
      eyesSvg = `
        <circle cx="40" cy="50" r="4" fill="#0F172A" />
        <circle cx="38.5" cy="48.5" r="1.5" fill="#FFFFFF" />
        <circle cx="60" cy="50" r="4" fill="#0F172A" />
        <circle cx="58.5" cy="48.5" r="1.5" fill="#FFFFFF" />
      `;
      break;
    default:
      eyesSvg = `
        <circle cx="40" cy="50" r="3.5" fill="#1E293B" />
        <circle cx="60" cy="50" r="3.5" fill="#1E293B" />
        <circle cx="39" cy="49" r="1" fill="#FFFFFF" />
        <circle cx="59" cy="49" r="1" fill="#FFFFFF" />
      `;
  }

  let mouthSvg = '';
  switch (mouth) {
    case 'big-smile':
      mouthSvg = `
        <path d="M42,61 Q50,71 58,61 Z" fill="#E11D48" stroke="#1E293B" stroke-width="1.5" />
        <path d="M44,62 Q50,65 56,62" fill="#FFFFFF" />
      `;
      break;
    case 'smirk':
      mouthSvg = `
        <path d="M44,63 Q52,62 58,58" stroke="#1E293B" stroke-width="2.5" stroke-linecap="round" fill="none" />
      `;
      break;
    case 'open':
      mouthSvg = `
        <ellipse cx="50" cy="62" rx="4" ry="5" fill="#BE123C" stroke="#1E293B" stroke-width="1.5" />
      `;
      break;
    default:
      mouthSvg = `
        <path d="M43,60 Q50,67 57,60" stroke="#1E293B" stroke-width="2.5" stroke-linecap="round" fill="none" />
      `;
  }

  const glassesSvg = glasses
    ? `
      <rect x="31" y="44" width="16" height="13" rx="3.5" fill="none" stroke="#1E293B" stroke-width="2" />
      <rect x="53" y="44" width="16" height="13" rx="3.5" fill="none" stroke="#1E293B" stroke-width="2" />
      <line x1="47" y1="50" x2="53" y2="50" stroke="#1E293B" stroke-width="2" />
      <line x1="26" y1="48" x2="31" y2="50" stroke="#1E293B" stroke-width="2" />
      <line x1="69" y1="50" x2="74" y2="48" stroke="#1E293B" stroke-width="2" />
    `
    : '';

  const blushSvg = blush
    ? `
      <circle cx="33" cy="56" r="4.5" fill="#FDA4AF" opacity="0.65" />
      <circle cx="67" cy="56" r="4.5" fill="#FDA4AF" opacity="0.65" />
    `
    : '';

  let accSvg = '';
  if (accessory === 'headphone') {
    accSvg = `
      <path d="M22,48 C22,18 78,18 78,48" stroke="#3B82F6" stroke-width="4" fill="none" stroke-linecap="round" />
      <rect x="18" y="44" width="7" height="16" rx="3.5" fill="#1D4ED8" />
      <rect x="75" y="44" width="7" height="16" rx="3.5" fill="#1D4ED8" />
    `;
  } else if (accessory === 'visor') {
    accSvg = `
      <path d="M24,46 L76,46 L73,54 L27,54 Z" fill="#06B6D4" opacity="0.85" stroke="#0891B2" stroke-width="1.5" />
      <line x1="28" y1="50" x2="72" y2="50" stroke="#EC4899" stroke-width="1.5" />
    `;
  } else if (accessory === 'earring') {
    accSvg = `
      <circle cx="26" cy="57" r="2" fill="#F59E0B" />
      <circle cx="74" cy="57" r="2" fill="#F59E0B" />
    `;
  }

  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
      <!-- Background -->
      <circle cx="50" cy="50" r="48" fill="${bg}" />
      
      <!-- Shoulders & Shirt -->
      <path d="M20,96 C20,74 34,70 50,70 C66,70 80,74 80,96 Z" fill="${shirt}" />
      <path d="M42,70 Q50,78 58,70 Z" fill="${skin}" opacity="0.9" />

      <!-- Neck -->
      <rect x="44" y="60" width="12" height="14" rx="3" fill="${skin}" />

      <!-- Head Base -->
      <circle cx="50" cy="52" r="24" fill="${skin}" />

      <!-- Ears -->
      <circle cx="26" cy="53" r="5" fill="${skin}" />
      <circle cx="74" cy="53" r="5" fill="${skin}" />

      <!-- Hair Behind/Top -->
      ${hairSvg}

      <!-- Blush -->
      ${blushSvg}

      <!-- Eyes & Eyebrows -->
      <path d="M35,43 Q40,40 45,43" stroke="#334155" stroke-width="1.5" stroke-linecap="round" fill="none" />
      <path d="M55,43 Q60,40 65,43" stroke="#334155" stroke-width="1.5" stroke-linecap="round" fill="none" />
      ${eyesSvg}

      <!-- Glasses -->
      ${glassesSvg}

      <!-- Nose -->
      <path d="M50,52 L48,56 L51,56" stroke="#D97706" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.75" />

      <!-- Mouth -->
      ${mouthSvg}

      <!-- Accessories -->
      ${accSvg}
    </svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

// Hand-Drawn Character Avatars for Students & Traders
export const DRAWING_AVATARS = {
  // Main User Tristan G. (Drawing with stylish glasses, cool teal hoodie & messy brown hair)
  tristan: createSvgAvatarDrawing({
    bg: '#D1FAE5',
    skin: '#FCD34D',
    hair: '#78350F',
    hairStyle: 'messy',
    shirt: '#065F46',
    glasses: true,
    blush: true,
    mouth: 'smile',
    eyes: 'sparkle',
  }),

  // Alex L. (Drawing with headphones & blue shirt)
  alex: createSvgAvatarDrawing({
    bg: '#DBEAFE',
    skin: '#FDE68A',
    hair: '#1E293B',
    hairStyle: 'short',
    shirt: '#2563EB',
    accessory: 'headphone',
    mouth: 'big-smile',
    eyes: 'happy',
  }),

  // Maria K. (Drawing with curly hair, purple shirt & cute blush)
  maria: createSvgAvatarDrawing({
    bg: '#FCE7F3',
    skin: '#FBBF24',
    hair: '#831843',
    hairStyle: 'curly',
    shirt: '#9333EA',
    blush: true,
    mouth: 'smile',
    eyes: 'sparkle',
  }),

  // Elena R. (Drawing with long hair & green jacket)
  elena: createSvgAvatarDrawing({
    bg: '#FEF3C7',
    skin: '#FCD34D',
    hair: '#B45309',
    hairStyle: 'long',
    shirt: '#059669',
    accessory: 'earring',
    blush: true,
    mouth: 'big-smile',
    eyes: 'wink',
  }),

  // David P. (Drawing with orange beanie & friendly smile)
  david: createSvgAvatarDrawing({
    bg: '#FFEDD5',
    skin: '#FDE047',
    hair: '#EA580C',
    hairStyle: 'beanie',
    shirt: '#0284C7',
    mouth: 'smile',
    eyes: 'happy',
  }),

  // Chloe B. (Drawing with bob haircut & yellow hoodie)
  chloe: createSvgAvatarDrawing({
    bg: '#ECFDF5',
    skin: '#FED7AA',
    hair: '#374151',
    hairStyle: 'bob',
    shirt: '#F59E0B',
    blush: true,
    mouth: 'smile',
    eyes: 'happy',
  }),

  // Marcus V. (Drawing with glasses & crisp navy polo)
  marcus: createSvgAvatarDrawing({
    bg: '#E0E7FF',
    skin: '#FBBF24',
    hair: '#1E1B4B',
    hairStyle: 'short',
    shirt: '#4338CA',
    glasses: true,
    mouth: 'smirk',
    eyes: 'normal',
  }),

  // Liam S. (Drawing with baseball cap & red jersey)
  liam: createSvgAvatarDrawing({
    bg: '#FEE2E2',
    skin: '#FCD34D',
    hair: '#DC2626',
    hairStyle: 'cap',
    shirt: '#B91C1C',
    mouth: 'big-smile',
    eyes: 'happy',
  }),

  // Jordan W. (Drawing with ponytail & glasses)
  jordan: createSvgAvatarDrawing({
    bg: '#F3E8FF',
    skin: '#FDE047',
    hair: '#6B21A8',
    hairStyle: 'ponytail',
    shirt: '#7C3AED',
    glasses: true,
    mouth: 'smile',
    eyes: 'sparkle',
  }),

  // Sarah T. (Drawing with pink sweater & blush)
  sarah: createSvgAvatarDrawing({
    bg: '#FFE4E6',
    skin: '#FED7AA',
    hair: '#9D174D',
    hairStyle: 'long',
    shirt: '#DB2777',
    blush: true,
    mouth: 'big-smile',
    eyes: 'happy',
  }),

  // Elias Vance (Drawing with retro sunglasses & denim jacket)
  elias: createSvgAvatarDrawing({
    bg: '#CFFAFE',
    skin: '#FCD34D',
    hair: '#1E293B',
    hairStyle: 'messy',
    shirt: '#0891B2',
    glasses: true,
    mouth: 'smirk',
    eyes: 'wink',
  }),

  // Cyber / Futuristic avatars
  nexusSyndicate: createSvgAvatarDrawing({
    bg: '#1E1B4B',
    skin: '#94A3B8',
    hair: '#06B6D4',
    hairStyle: 'cyber',
    shirt: '#3B82F6',
    accessory: 'visor',
    mouth: 'smirk',
    eyes: 'sparkle',
  }),

  stationOutpost: createSvgAvatarDrawing({
    bg: '#0F172A',
    skin: '#CBD5E1',
    hair: '#E2E8F0',
    hairStyle: 'short',
    shirt: '#64748B',
    accessory: 'headphone',
    mouth: 'smile',
    eyes: 'normal',
  }),

  cyberDrone: createSvgAvatarDrawing({
    bg: '#18181B',
    skin: '#38BDF8',
    hair: '#F43F5E',
    hairStyle: 'cyber',
    shirt: '#0284C7',
    accessory: 'visor',
    mouth: 'open',
    eyes: 'sparkle',
  }),
};

// Curated array of drawn avatars for user selection during Signup and Profile edit
export const DRAWN_AVATAR_PRESETS = [
  { id: 'drawn-tristan', name: 'Student Trader (Glasses)', url: DRAWING_AVATARS.tristan },
  { id: 'drawn-alex', name: 'Campus Techie (Headphones)', url: DRAWING_AVATARS.alex },
  { id: 'drawn-maria', name: 'Creative Designer (Curly Hair)', url: DRAWING_AVATARS.maria },
  { id: 'drawn-elena', name: 'Bookworm (Long Hair)', url: DRAWING_AVATARS.elena },
  { id: 'drawn-david', name: 'Cozy Trader (Beanie)', url: DRAWING_AVATARS.david },
  { id: 'drawn-chloe', name: 'Plant Enthusiast (Bob)', url: DRAWING_AVATARS.chloe },
  { id: 'drawn-marcus', name: 'Engineer (Polo & Glasses)', url: DRAWING_AVATARS.marcus },
  { id: 'drawn-liam', name: 'Athlete (Baseball Cap)', url: DRAWING_AVATARS.liam },
  { id: 'drawn-jordan', name: 'Honor Student (Ponytail)', url: DRAWING_AVATARS.jordan },
  { id: 'drawn-sarah', name: 'Artisan (Pink Sweater)', url: DRAWING_AVATARS.sarah },
  { id: 'drawn-elias', name: 'Vintage Collector (Shades)', url: DRAWING_AVATARS.elias },
  { id: 'drawn-nexus', name: 'Cyberpunk Nomad', url: DRAWING_AVATARS.nexusSyndicate },
];

/**
 * Ensures any avatar URL is an illustrated drawing.
 * If a legacy unsplash image URL is detected, it maps it cleanly to the appropriate drawing.
 */
export function sanitizeToDrawingAvatar(urlOrName?: string): string {
  if (!urlOrName) return DRAWING_AVATARS.tristan;

  // If it's already an SVG drawing data URI, return it
  if (urlOrName.startsWith('data:image/svg+xml') || urlOrName.includes('api.dicebear.com')) {
    return urlOrName;
  }

  const str = urlOrName.toLowerCase();
  if (str.includes('tristan') || str.includes('me') || str.includes('534528741775')) {
    return DRAWING_AVATARS.tristan;
  }
  if (str.includes('alex') || str.includes('535713875002')) {
    return DRAWING_AVATARS.alex;
  }
  if (str.includes('maria') || str.includes('494790108377')) {
    return DRAWING_AVATARS.maria;
  }
  if (str.includes('elena') || str.includes('580489944761')) {
    return DRAWING_AVATARS.elena;
  }
  if (str.includes('david') || str.includes('570295999919')) {
    return DRAWING_AVATARS.david;
  }
  if (str.includes('chloe') || str.includes('544005313')) {
    return DRAWING_AVATARS.chloe;
  }
  if (str.includes('marcus') || str.includes('507003211169')) {
    return DRAWING_AVATARS.marcus;
  }
  if (str.includes('liam') || str.includes('500648767791')) {
    return DRAWING_AVATARS.liam;
  }
  if (str.includes('jordan') || str.includes('522075469751')) {
    return DRAWING_AVATARS.jordan;
  }
  if (str.includes('sarah') || str.includes('438761681033')) {
    return DRAWING_AVATARS.sarah;
  }
  if (str.includes('elias') || str.includes('vance')) {
    return DRAWING_AVATARS.elias;
  }
  if (str.includes('nexus') || str.includes('corpo')) {
    return DRAWING_AVATARS.nexusSyndicate;
  }
  if (str.includes('station') || str.includes('orbit')) {
    return DRAWING_AVATARS.stationOutpost;
  }
  if (str.includes('drone') || str.includes('fleet')) {
    return DRAWING_AVATARS.cyberDrone;
  }

  // Fallback to random drawing based on string hash
  const keys = Object.keys(DRAWING_AVATARS) as (keyof typeof DRAWING_AVATARS)[];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % keys.length;
  return DRAWING_AVATARS[keys[idx]];
}
