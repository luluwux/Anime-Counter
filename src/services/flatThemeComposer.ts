import { escapeHtml, validateColor } from '../utils/sanitize.js';

export interface FlatThemeOptions {
  bg?: string;        // Arka plan rengi (Hex veya CSS name)
  color?: string;     // Yazı rengi (Hex veya CSS name)
  icon?: string;      // Emoji (örn: 🔥, 🚀, ❤️)
  animation?: string; // 'fade', 'slide', 'pulse', 'none'
  stroke?: string;    // Çerçeve rengi
  scale?: number;     // Boyutlandırma çarpanı (Örn: 1.5)
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1
  }).format(num);
}

function getAnimationCSS(type: string): string {
  switch (type) {
    case 'fade':
      return `
        @keyframes anim { 0% { opacity: 0; } 100% { opacity: 1; } }
        .content { animation: anim 1.5s ease-out forwards; }
      `;
    case 'slide':
      return `
        @keyframes anim { 0% { transform: translateY(-10px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        .content { animation: anim 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
      `;
    case 'pulse':
      return `
        @keyframes anim { 0% { transform: scale(0.9); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
        .content { animation: anim 0.6s ease-in-out forwards; transform-origin: center; }
      `;
    default:
      return '';
  }
}

export function generateFlatSVG(count: number, options: FlatThemeOptions = {}): string {
  const formattedCount = formatNumber(count);
  
  // Renk parametrelerini enjeksiyona karşı koru
  const bgColor = validateColor(options.bg, '#21262d');
  const textColor = validateColor(options.color, '#c9d1d9');
  const strokeColor = validateColor(options.stroke, '#30363d');
  
  // Emojiyi enjeksiyona karşı koru
  const iconText = options.icon ? `${escapeHtml(options.icon)} ` : '';
  const fullText = `${iconText}${formattedCount}`;

  const charWidth = 9; 
  const basePadding = 24; 
  const textWidth = (formattedCount.length * charWidth) + (options.icon ? 20 : 0);
  const totalWidth = Math.max(80, textWidth + basePadding); 
  const height = 28;

  const scale = options.scale || 1;
  const scaledWidth = totalWidth * scale;
  const scaledHeight = height * scale;

  const animationCSS = getAnimationCSS(options.animation || 'none');

  return `
    <svg width="${scaledWidth}" height="${scaledHeight}" viewBox="0 0 ${totalWidth} ${height}" 
         xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .text { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
            font-weight: 600; 
            font-size: 14px;
          }
          ${animationCSS}
        </style>
      </defs>
      
      <g class="content">
        <rect width="${totalWidth}" height="${height}" rx="6" 
              fill="${bgColor}" stroke="${strokeColor}" stroke-width="1" />
              
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
              fill="${textColor}" class="text">
          ${fullText}
        </text>
      </g>
    </svg>
  `;
}
