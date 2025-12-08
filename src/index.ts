import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { redis } from './config/Redis.js';

import { loadImages, generateImageSVG, getAvailableImageThemes } from './services/imageComposer.js';
import { generateFlatSVG, FlatThemeOptions } from './services/flatThemeComposer.js';

const fastify = Fastify({ logger: true, trustProxy: true });

fastify.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
  errorResponseBuilder: () => ({ statusCode: 429, error: 'Limit', message: 'Rate limit exceeded' })
});

fastify.register(cors, { origin: '*' });

interface CounterQuery {
  theme?: string;
  length?: string; 
  render?: string;
  bg?: string;
  color?: string;
  icon?: string;      
  animation?: string; // 'fade', 'slide', 'pulse'
  stroke?: string;
}

fastify.get<{ Params: { username: string }, Querystring: CounterQuery }>('/@:username', async (request, reply) => {
  const { username } = request.params;
  // Parametreleri ayıkla
  const { theme, length, render, bg, color, icon, animation, stroke } = request.query;

  // 1. Kullanıcı Adı Kontrolü
  const cleanUsername = username.replace(/[^a-zA-Z0-9-_]/g, '');
  if (!cleanUsername) return reply.status(400).send({ error: 'Invalid username' });

  // 2. Tema Mantığı (Routing)
  // Tema 'flat' ise veya boşsa VE ayrıca 'naruto' gibi bir resim teması değilse -> Flat kullan
  const imageThemes = getAvailableImageThemes();
  let useFlat = false;

  if (!theme || theme === 'flat' || !imageThemes.includes(theme)) {
    useFlat = true;
  }

  // 3. Sayaç Verisi (Redis)
  let count = 0;
  try {
    const redisKey = `counter:${cleanUsername}`;
    if (render === 'true') {
      const val = await redis.get(redisKey);
      count = val ? parseInt(val) : 0;
    } else {
      count = await redis.incr(redisKey);
    }
  } catch (err) {
    fastify.log.error(err);
  }

  let svgContent = '';

  try {
    if (useFlat) {
      const options: FlatThemeOptions = {
        bg: bg,          
        color: color,     
        icon: icon,       
        animation: animation, 
        stroke: stroke
      };
      svgContent = generateFlatSVG(count, options);

    } else {
      let padding = length ? parseInt(length) : 7;
      if (padding > 20) padding = 20;
            svgContent = generateImageSVG(theme as string, count, padding);
    }

    reply.header('Content-Type', 'image/svg+xml');
    reply.header('Cache-Control', 'max-age=0, no-cache, no-store, must-revalidate');
    reply.header('Expires', '0');
    
    return reply.send(svgContent);

  } catch (error) {
    fastify.log.error(error);
    reply.header('Content-Type', 'image/svg+xml');
    return reply.send(`<svg width="100" height="20"><text y="15" fill="red">Error</text></svg>`);
  }
});

fastify.get('/themes', async () => {
  return { 
    type: 'success',
    flat_support: true,
    image_themes: getAvailableImageThemes() 
  };
});

const start = async () => {
  try {
    await loadImages();
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Sunucu Hazır: http://localhost:${port}`);
    console.log(`✨ Flat Tema: Animasyon ve Emoji destekli!`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
