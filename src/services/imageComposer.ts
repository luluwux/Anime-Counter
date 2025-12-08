import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs'; // existsSync senkron kontrol için gerekli
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const themeCacheBase64: Record<string, Record<string, string>> = {}; 
const themeDimensions: Record<string, { width: number; height: number }> = {};

export async function loadImages() {
  console.log("📂 Temalar taranıyor (PNG ve GIF destekli)...");
  
  const assetsDir = path.join(__dirname, '../assets');
  if (!existsSync(assetsDir)) {
    console.warn("⚠️ Assets klasörü yok, sadece Flat tema çalışacak.");
    return;
  }

  const entries = await fs.readdir(assetsDir, { withFileTypes: true });
  for (const dirent of entries) {
    if (!dirent.isDirectory()) continue;
    
    const theme = dirent.name;
    themeCacheBase64[theme] = {};
    let dimensionsFound = false;

    for (let i = 0; i <= 9; i++) {
        const gifPath = path.join(assetsDir, theme, `${i}.gif`);
        const pngPath = path.join(assetsDir, theme, `${i}.png`);
        
        let targetPath = '';
        let mimeType = '';

      
        if (existsSync(gifPath)) {
            targetPath = gifPath;
            mimeType = 'image/gif';
        } else if (existsSync(pngPath)) {
            targetPath = pngPath;
            mimeType = 'image/png';
        } else {
            continue; 
        }

        try {
            const buffer = await fs.readFile(targetPath);
           
            if (!dimensionsFound) {
              
                const meta = await sharp(buffer).metadata();
                themeDimensions[theme] = { width: meta.width || 0, height: meta.height || 0 };
                dimensionsFound = true;
            }
            
        
            themeCacheBase64[theme][i.toString()] = `data:${mimeType};base64,${buffer.toString('base64')}`;
        } catch (e) {
            console.error(`Hata (${theme}/${i}):`, e);
        }
    }
  }
  console.log(`✅ Tüm temalar (PNG/GIF) yüklendi.`);
}

export function generateImageSVG(theme: string, count: number, padding: number = 7): string {
  if (!themeCacheBase64[theme] || !themeDimensions[theme]) {
    throw new Error(`Tema bulunamadı: ${theme}`);
  }

  const { width, height } = themeDimensions[theme];
  const digits = count.toString().padStart(padding, '0').split('');
  const totalWidth = width * digits.length;

  const imageParts = digits.map((digit, index) => {
    const base64Data = themeCacheBase64[theme][digit];
    if (!base64Data) return '';
   
    return `<image x="${index * width}" y="0" width="${width}" height="${height}" href="${base64Data}" />`;
  }).join('');

  return `
    <svg width="${totalWidth}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <g>${imageParts}</g>
    </svg>
  `;
}

export function getAvailableImageThemes(): string[] {
    return Object.keys(themeCacheBase64);
}
