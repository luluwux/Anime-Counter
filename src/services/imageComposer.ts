// Memory caches for Workers Isolate scope (RAM)
const base64Cache = new Map<string, string>();
const dimensionsCache = new Map<string, { width: number; height: number }>();

// Predefined dimensions for default themes (avoids initial R2/KV lookup)
const DEFAULT_THEME_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "adventuretime": { "width": 243, "height": 330 },
  "aot": { "width": 262, "height": 345 },
  "bleach": { "width": 210, "height": 345 },
  "codegeass": { "width": 164, "height": 323 },
  "dragonball": { "width": 260, "height": 345 },
  "gumball": { "width": 245, "height": 325 },
  "l": { "width": 140, "height": 249 },
  "monster": { "width": 96, "height": 96 },
  "naruto": { "width": 157, "height": 400 },
  "onepiece": { "width": 269, "height": 345 }
};

// Available themes (preloaded default list)
const AVAILABLE_THEMES = Object.keys(DEFAULT_THEME_DIMENSIONS);

/**
 * Pure JS helper to parse PNG/GIF dimensions from Uint8Array
 */
function parseImageDimensions(bytes: Uint8Array): { width: number; height: number } {
  try {
    // PNG Check
    if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
      const width = (bytes[16] << 24) | (bytes[17] << 16) | (bytes[18] << 8) | bytes[19];
      const height = (bytes[20] << 24) | (bytes[21] << 16) | (bytes[22] << 8) | bytes[23];
      return { width, height };
    }
    
    // GIF Check
    if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
      const width = bytes[6] | (bytes[7] << 8);
      const height = bytes[8] | (bytes[9] << 8);
      return { width, height };
    }
  } catch (e) {
    console.error("Image dimensions parsing error:", e);
  }
  
  return { width: 0, height: 0 };
}

/**
 * Converts a Uint8Array to base64 string
 */
function uint8ArrayToBase64(arr: Uint8Array): string {
  let binary = '';
  const len = arr.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(arr[i]);
  }
  return btoa(binary);
}

/**
 * Fetches image theme dimensions from cache or R2
 */
async function getThemeDimensions(
  theme: string,
  kv: KVNamespace | undefined,
  r2: R2Bucket | undefined
): Promise<{ width: number; height: number }> {
  // 1. Check Memory Cache
  if (dimensionsCache.has(theme)) {
    return dimensionsCache.get(theme)!;
  }

  // 2. Check Defaults
  if (DEFAULT_THEME_DIMENSIONS[theme]) {
    const dim = DEFAULT_THEME_DIMENSIONS[theme];
    dimensionsCache.set(theme, dim);
    return dim;
  }

  // 3. Check KV
  const kvKey = `theme:${theme}:dimensions`;
  if (kv) {
    try {
      const cached = await kv.get(kvKey, 'json') as { width: number; height: number } | null;
      if (cached) {
        dimensionsCache.set(theme, cached);
        return cached;
      }
    } catch (e) {
      console.error("KV read error for dimensions:", e);
    }
  }

  // 4. Fetch from R2 to detect dimensions dynamically
  if (r2) {
    try {
      // Find digit 0 in R2 to parse dimensions
      for (const ext of ['png', 'gif']) {
        const obj = await r2.get(`assets/${theme}/0.${ext}`);
        if (obj) {
          const buffer = new Uint8Array(await obj.arrayBuffer());
          const dims = parseImageDimensions(buffer);
          if (dims.width > 0 && dims.height > 0) {
            dimensionsCache.set(theme, dims);
            if (kv) {
              await kv.put(kvKey, JSON.stringify(dims));
            }
            return dims;
          }
        }
      }
    } catch (e) {
      console.error("R2 read error for dimensions:", e);
    }
  }

  // Fallback default
  return { width: 100, height: 100 };
}

/**
 * Fetches a single digit image as base64 from memory, KV, or R2
 */
async function getDigitBase64(
  theme: string,
  digit: string,
  kv: KVNamespace | undefined,
  r2: R2Bucket | undefined
): Promise<string> {
  const cacheKey = `${theme}:${digit}`;

  // 1. Check Memory Cache
  if (base64Cache.has(cacheKey)) {
    return base64Cache.get(cacheKey)!;
  }

  // 2. Check KV
  const kvKey = `theme:${theme}:${digit}`;
  if (kv) {
    try {
      const cached = await kv.get(kvKey);
      if (cached) {
        base64Cache.set(cacheKey, cached);
        return cached;
      }
    } catch (e) {
      console.error("KV read error for digit base64:", e);
    }
  }

  // 3. Fetch from R2
  if (r2) {
    try {
      for (const ext of ['png', 'gif']) {
        const obj = await r2.get(`assets/${theme}/${digit}.${ext}`);
        if (obj) {
          const mimeType = ext === 'png' ? 'image/png' : 'image/gif';
          const buffer = new Uint8Array(await obj.arrayBuffer());
          const base64Str = `data:${mimeType};base64,${uint8ArrayToBase64(buffer)}`;
          
          // Cache in memory and KV
          base64Cache.set(cacheKey, base64Str);
          if (kv) {
            await kv.put(kvKey, base64Str);
          }
          return base64Str;
        }
      }
    } catch (e) {
      console.error("R2 read error for digit base64:", e);
    }
  }

  throw new Error(`Asset not found in R2: theme ${theme}, digit ${digit}`);
}

/**
 * Generates the SVG representation of the image counter
 */
export async function generateImageSVG(
  theme: string,
  count: number,
  padding: number = 7,
  kv: KVNamespace | undefined,
  r2: R2Bucket | undefined,
  scale: number = 1,
  pixelated: boolean = true
): Promise<string> {
  const { width, height } = await getThemeDimensions(theme, kv, r2);
  const digits = count.toString().padStart(padding, '0').split('');
  const totalWidth = width * digits.length;

  const imageRendering = pixelated ? 'image-rendering: pixelated;' : '';

  const imagePartsPromises = digits.map(async (digit, index) => {
    try {
      const base64Data = await getDigitBase64(theme, digit, kv, r2);
      return `<image x="${index * width}" y="0" width="${width}" height="${height}" href="${base64Data}" style="${imageRendering}" />`;
    } catch (e) {
      console.error(`Error loading digit ${digit} for theme ${theme}:`, e);
      return '';
    }
  });

  const imageParts = (await Promise.all(imagePartsPromises)).join('');

  const scaledWidth = totalWidth * scale;
  const scaledHeight = height * scale;

  return `
    <svg width="${scaledWidth}" height="${scaledHeight}" viewBox="0 0 ${totalWidth} ${height}" xmlns="http://www.w3.org/2000/svg">
      <g>${imageParts}</g>
    </svg>
  `;
}

export function getAvailableImageThemes(): string[] {
  return AVAILABLE_THEMES;
}
