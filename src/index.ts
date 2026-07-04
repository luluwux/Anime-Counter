import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { getAndIncrement } from './config/storage.js';
import { generateImageSVG, getAvailableImageThemes } from './services/imageComposer.js';
import { generateFlatSVG, FlatThemeOptions } from './services/flatThemeComposer.js';
import { getGeneratorHTML } from './views/generator.js';

type Bindings = {
  KV?: KVNamespace;
  R2?: R2Bucket;
};

const app = new Hono<{ Bindings: Bindings }>();

// CORS Desteği (Her kökenden erişim için)
app.use('*', cors({ origin: '*' }));

// 3. Arayüz / Generator Ana Sayfası
app.get('/', (c) => {
  return c.html(getGeneratorHTML());
});

// 2. Desteklenen Temalar Rotası (Statik rotalar parametrik rotalardan önce tanımlanmalıdır)
app.get('/themes', (c) => {
  return c.json({
    type: 'success',
    flat_support: true,
    image_themes: getAvailableImageThemes()
  });
});

// 1. Sayaç Rotası (Örn: /@luluwux)
app.get('/:username', async (c) => {
  const username = c.req.param('username');

  // Rota sadece @ ile başlıyorsa eşleşsin
  if (!username.startsWith('@')) {
    return c.notFound();
  }
  
  // Query parametrelerini ayıkla
  const theme = c.req.query('theme');
  const length = c.req.query('length');
  const render = c.req.query('render');
  const bg = c.req.query('bg');
  const color = c.req.query('color');
  const icon = c.req.query('icon');
  const animation = c.req.query('animation');
  const stroke = c.req.query('stroke');
  
  // Yeni parametreler
  const scaleQuery = c.req.query('scale');
  let scale = scaleQuery ? parseFloat(scaleQuery) : 1;
  if (isNaN(scale) || scale < 0.1 || scale > 10) {
    scale = 1;
  }
  
  const pixelatedQuery = c.req.query('pixelated');
  const pixelated = pixelatedQuery !== '0'; // default true, false on '0'
  
  const numQuery = c.req.query('num');
  const numVal = numQuery ? parseInt(numQuery, 10) : NaN;

  // Kullanıcı adı temizleme (sadece güvenli karakterler)
  const cleanUsername = username.slice(1).replace(/[^a-zA-Z0-9-_]/g, '');
  if (!cleanUsername) {
    return c.json({ error: 'Invalid username' }, 400);
  }

  // Sadece render isteği (görüntüleme) ve tarayıcı cache kontrolü
  const isRenderOnly = render === 'true';

  // Cloudflare Cache API kontrolü (Sadece okuma istekleri için cache et)
  const hasCacheAPI = typeof caches !== 'undefined';
  const cache = hasCacheAPI ? caches.default : null;
  const cacheKey = new Request(c.req.url, c.req.raw);
  
  if (isRenderOnly && cache) {
    const cachedResponse = await cache.match(cacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }
  }

  // Tema seçimi mantığı
  const imageThemes = getAvailableImageThemes();
  let useFlat = false;

  if (!theme || theme === 'flat' || !imageThemes.includes(theme)) {
    useFlat = true;
  }

  // Sayacı oku ve/veya artır
  const env = c.env || {};
  let count = 0;
  if (!isNaN(numVal)) {
    count = numVal;
  } else {
    count = await getAndIncrement(env.KV, cleanUsername, isRenderOnly);
  }

  let svgContent = '';

  try {
    if (useFlat) {
      const options: FlatThemeOptions = {
        bg,
        color,
        icon,
        animation,
        stroke,
        scale
      };
      svgContent = generateFlatSVG(count, options);
    } else {
      let padding = length ? parseInt(length, 10) : 7;
      if (isNaN(padding) || padding < 1) {
        padding = 7;
      }
      if (padding > 20) {
        padding = 20;
      }
      svgContent = await generateImageSVG(theme as string, count, padding, env.KV, env.R2, scale, pixelated);
    }

    // SVG yanıt nesnesini oluştur
    const response = new Response(svgContent, {
      headers: {
        'Content-Type': 'image/svg+xml',
        // Tarayıcı ve GitHub Camo önbelleklemesini tamamen kapat (gerçek zamanlı sayaç için)
        'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate',
        'Expires': '0',
        'Pragma': 'no-cache'
      }
    });

    // Sadece okuma isteklerini 5 saniyeliğine Cloudflare Edge'de cache'le
    if (isRenderOnly && cache) {
      response.headers.set('Cache-Control', 'public, s-maxage=5');
      c.executionCtx.waitUntil(cache.put(cacheKey, response.clone()));
    }

    return response;

  } catch (error: any) {
    console.error(`Render hatası (${cleanUsername}):`, error);
    
    // Hata durumunda kırmızı bir fallback SVG döner
    return new Response(
      `<svg width="100" height="20" xmlns="http://www.w3.org/2000/svg"><text y="15" fill="red">Error</text></svg>`,
      {
        status: 500,
        headers: { 'Content-Type': 'image/svg+xml' }
      }
    );
  }
});

// Temalar rotası yukarıya taşındı

export default app;
