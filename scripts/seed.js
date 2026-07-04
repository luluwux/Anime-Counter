import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.join(__dirname, '../src/assets');
const isLocal = process.argv.includes('--local') || !process.argv.includes('--production');
const bucketName = 'anime-counter-assets';

console.log(`🚀 Seeding R2 bucket (${bucketName}) - Mode: ${isLocal ? 'LOCAL' : 'PRODUCTION'}`);

if (!fs.existsSync(assetsDir)) {
  console.error(`❌ Assets klasörü bulunamadı: ${assetsDir}`);
  process.exit(1);
}

try {
  const themes = fs.readdirSync(assetsDir).filter(f => fs.statSync(path.join(assetsDir, f)).isDirectory());

  for (const theme of themes) {
    console.log(`📂 Tema yükleniyor: ${theme}...`);
    const themePath = path.join(assetsDir, theme);
    
    for (let i = 0; i <= 9; i++) {
      let ext = '';
      if (fs.existsSync(path.join(themePath, `${i}.png`))) {
        ext = 'png';
      } else if (fs.existsSync(path.join(themePath, `${i}.gif`))) {
        ext = 'gif';
      }

      if (!ext) continue;

      const fileName = `${i}.${ext}`;
      const filePath = path.join(themePath, fileName);
      const r2Key = `assets/${theme}/${fileName}`;
      
      const localFlag = isLocal ? '--local' : '';
      const command = `npx wrangler r2 object put ${bucketName}/${r2Key} --file "${filePath}" ${localFlag}`;
      
      console.log(`   Uploading: ${theme}/${fileName} -> R2Key: ${r2Key}`);
      execSync(command, { stdio: 'inherit' });
    }
  }
  console.log('✅ R2 Seeding işlemi başarıyla tamamlandı!');
} catch (error) {
  console.error('❌ Hata oluştu:', error);
  process.exit(1);
}
